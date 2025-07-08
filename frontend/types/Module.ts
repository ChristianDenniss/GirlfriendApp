export interface Module {
  id: string;
  name: string;
  type: 'todo' | 'groceries' | 'bucketlist';
  icon?: string;
  createdAt: Date;
} 