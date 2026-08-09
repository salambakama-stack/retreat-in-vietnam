const DEPOSIT_AMOUNT_TWD = 15000;

const PAYMENT_STATUSES = Object.freeze({
  PENDING_DEPOSIT: '待付訂金',
  DEPOSIT_PAID: '已付訂金',
  PENDING_BALANCE: '待付尾款',
  PAID_IN_FULL: '已完成付款',
  CANCELLED: '已取消',
});

const PAYMENT_STATUS_FLOW = Object.freeze({
  [PAYMENT_STATUSES.PENDING_DEPOSIT]: [
    PAYMENT_STATUSES.DEPOSIT_PAID,
    PAYMENT_STATUSES.CANCELLED,
  ],
  [PAYMENT_STATUSES.DEPOSIT_PAID]: [
    PAYMENT_STATUSES.PENDING_BALANCE,
    PAYMENT_STATUSES.CANCELLED,
  ],
  [PAYMENT_STATUSES.PENDING_BALANCE]: [
    PAYMENT_STATUSES.PAID_IN_FULL,
    PAYMENT_STATUSES.CANCELLED,
  ],
  [PAYMENT_STATUSES.PAID_IN_FULL]: [],
  [PAYMENT_STATUSES.CANCELLED]: [],
});

const ROOM_PLANS = Object.freeze({
  gardenSingle25: {
    id: 'gardenSingle25',
    labelZh: '花園單人房 25㎡',
    labelEn: 'Garden Single Room 25 sqm',
    formValue: '花園單人房 25㎡ / Garden Single Room 25 sqm',
    priceTwd: 39800,
    depositTwd: DEPOSIT_AMOUNT_TWD,
    occupancy: 1,
  },
  gardenSingle35: {
    id: 'gardenSingle35',
    labelZh: '花園單人房 35㎡',
    labelEn: 'Garden Single Room 35 sqm',
    formValue: '花園單人房 35㎡ / Garden Single Room 35 sqm',
    priceTwd: 42800,
    depositTwd: DEPOSIT_AMOUNT_TWD,
    occupancy: 1,
  },
  gardenTwin35: {
    id: 'gardenTwin35',
    labelZh: '花園雙床客房 35㎡',
    labelEn: 'Garden Twin Room 35 sqm',
    formValue: '花園雙床客房 35㎡ / Garden Twin Room 35 sqm',
    priceTwd: 32800,
    depositTwd: DEPOSIT_AMOUNT_TWD,
    occupancy: 2,
  },
  gardenBungalowFour: {
    id: 'gardenBungalowFour',
    labelZh: '四人庭園雙臥木屋',
    labelEn: 'Garden Bungalow for Four',
    formValue: '四人庭園雙臥木屋 / Garden Bungalow for Four',
    priceTwd: 36800,
    depositTwd: DEPOSIT_AMOUNT_TWD,
    occupancy: 4,
  },
  gardenBungalowThree: {
    id: 'gardenBungalowThree',
    labelZh: '三人庭園雙臥木屋',
    labelEn: 'Garden Bungalow for Three',
    formValue: '三人庭園雙臥木屋 / Garden Bungalow for Three',
    priceTwd: 40800,
    depositTwd: DEPOSIT_AMOUNT_TWD,
    occupancy: 3,
  },
  privateBungalowDouble: {
    id: 'privateBungalowDouble',
    labelZh: '獨棟庭園木屋雙人',
    labelEn: 'Private Bungalow for Two',
    formValue: '獨棟庭園木屋雙人 / Private Bungalow for Two',
    priceTwd: 45800,
    depositTwd: DEPOSIT_AMOUNT_TWD,
    occupancy: 2,
  },
});

const PAYMENT_PROVIDER_RESERVATION = Object.freeze({
  provider: 'newebpay',
  enabled: false,
  mode: 'reserved',
  implementedFeatures: [],
  pendingFeatures: ['api', 'webhook', 'reconciliation', 'payment-page'],
});

const FORM_ROOM_ENTRY_ID = 'entry.1862495116';

function formatTwd(amount) {
  return `NT$${Number(amount).toLocaleString('en-US')}`;
}

function calculateBalance(priceTwd, depositTwd = DEPOSIT_AMOUNT_TWD) {
  if (!Number.isFinite(priceTwd) || priceTwd < depositTwd) {
    throw new Error('Room price must be a number greater than or equal to the deposit.');
  }

  return priceTwd - depositTwd;
}

function getRoomPaymentPlan(roomId) {
  const room = ROOM_PLANS[roomId];
  if (!room) throw new Error(`Unknown room id: ${roomId}`);

  return Object.freeze({
    ...room,
    balanceTwd: calculateBalance(room.priceTwd, room.depositTwd),
    currency: 'TWD',
    initialStatus: PAYMENT_STATUSES.PENDING_DEPOSIT,
  });
}

function createPaymentRecord({
  registrationId = null,
  roomId,
  participantId = null,
  status = PAYMENT_STATUSES.PENDING_DEPOSIT,
} = {}) {
  const plan = getRoomPaymentPlan(roomId);

  return Object.freeze({
    registrationId,
    participantId,
    roomId: plan.id,
    status,
    currency: plan.currency,
    totalAmountTwd: plan.priceTwd,
    depositAmountTwd: plan.depositTwd,
    balanceAmountTwd: plan.balanceTwd,
    provider: PAYMENT_PROVIDER_RESERVATION.provider,
    providerPaymentId: null,
    paidDepositAt: null,
    paidBalanceAt: null,
    cancelledAt: null,
  });
}

function getRoomIdFromFormUrl(url) {
  const parsedUrl = new URL(url, window.location.href);
  const formValue = parsedUrl.searchParams.get(FORM_ROOM_ENTRY_ID);

  return Object.values(ROOM_PLANS).find((room) => room.formValue === formValue)?.id || null;
}

function decorateRoomSelectLinks() {
  document.querySelectorAll('.room-select[href]').forEach((link) => {
    const roomId = getRoomIdFromFormUrl(link.href);
    if (!roomId) return;

    const plan = getRoomPaymentPlan(roomId);
    link.dataset.roomId = plan.id;
    link.dataset.totalAmountTwd = String(plan.priceTwd);
    link.dataset.depositAmountTwd = String(plan.depositTwd);
    link.dataset.balanceAmountTwd = String(plan.balanceTwd);
    link.dataset.paymentStatus = plan.initialStatus;
  });
}

if (typeof window !== 'undefined') {
  window.RetreatPayment = Object.freeze({
    depositAmountTwd: DEPOSIT_AMOUNT_TWD,
    paymentStatuses: PAYMENT_STATUSES,
    paymentStatusFlow: PAYMENT_STATUS_FLOW,
    roomPlans: ROOM_PLANS,
    providerReservation: PAYMENT_PROVIDER_RESERVATION,
    formatTwd,
    calculateBalance,
    getRoomPaymentPlan,
    createPaymentRecord,
  });

  decorateRoomSelectLinks();
}

export {
  DEPOSIT_AMOUNT_TWD,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_FLOW,
  ROOM_PLANS,
  PAYMENT_PROVIDER_RESERVATION,
  formatTwd,
  calculateBalance,
  getRoomPaymentPlan,
  createPaymentRecord,
};
