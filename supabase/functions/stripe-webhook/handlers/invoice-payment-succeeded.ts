import { sendVendasWebhook } from "../utils.ts";

export async function handleInvoicePaymentSucceeded(
  event: any,
  stripe: any,
  supabase: any
): Promise<void> {
  console.log("Processing invoice payment succeeded:", event.id);

  const invoice = event.data.object;
  // Payload oficial: subscription pode vir em invoice.subscription (API antiga)
  // ou em invoice.parent.subscription_details.subscription (API 2024+)
  const subscriptionId =
    invoice.subscription ??
    invoice.parent?.subscription_details?.subscription;

  if (!subscriptionId) {
    console.log("No subscription ID in invoice, skipping");
    return;
  }

  console.log("Payment succeeded for subscription:", subscriptionId);

  // Retrieve the subscription to get the latest status
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Período: usar subscription retornada; fallback para o período do line item da invoice
  // (no payload, lines.data[0].period.end = próximo current_period_end)
  const firstLine = invoice.lines?.data?.[0];
  const periodEnd =
    subscription.current_period_end ??
    firstLine?.period?.end;
  const periodStart =
    subscription.current_period_start ??
    firstLine?.period?.start;

  if (!periodEnd) {
    console.warn("Could not determine current_period_end for subscription:", subscriptionId);
  }

  console.log(`Updating subscription ${subscriptionId} to status: ${subscription.status}, period_end: ${periodEnd}`);

  // Update subscription status to reflect successful payment
  const updatePayload: Record<string, unknown> = {
    status: subscription.status,
    cancel_at_period_end: subscription.cancel_at_period_end,
  };
  if (periodStart) {
    updatePayload.current_period_start = new Date(periodStart * 1000).toISOString();
  }
  if (periodEnd) {
    updatePayload.current_period_end = new Date(periodEnd * 1000).toISOString();
  }

  const { error } = await supabase
    .from("poupeja_subscriptions")
    .update(updatePayload)
    .eq("stripe_subscription_id", subscriptionId);

  if (error) {
    console.error("Error updating subscription after payment success:", error);
    throw error;
  }

  console.log(`Subscription ${subscriptionId} successfully updated after payment confirmation`);

  // Enviar webhook de comunicação de vendas
  // Buscar o user_id da subscription
  const { data: subscriptionData, error: subError } = await supabase
    .from("poupeja_subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", subscriptionId)
    .single();

  if (!subError && subscriptionData?.user_id) {
    // O valor está em centavos, então dividimos por 100
    const valor = (invoice.amount_paid || 0) / 100;
    if (valor > 0) {
      await sendVendasWebhook(supabase, subscriptionData.user_id, valor);
    }
  }
}