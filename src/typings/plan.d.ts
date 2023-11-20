export interface Plan extends Object {
  id: string;
  dueTime: string; // 开始时间
  avatar: string;
  title: string;
  notes: string;
  time: number; // 用时
  isComplete: boolean; // 是否完成
}
