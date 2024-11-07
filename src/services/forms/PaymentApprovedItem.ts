export interface PaymentApprovedItem {
  approver: string;
  approvedTime: number;
  isRejected: boolean;
  isBlockData: boolean;
  reason: string;
  description: string;
}
