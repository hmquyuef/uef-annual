export interface PaymentApprovedItem {
  userName: string;
  fullName: string;
  confirmationType: number;
  confirmationTime: number;
  isRejected: boolean;
  isBlockData: boolean;
  reason: string;
  description: string;
}
