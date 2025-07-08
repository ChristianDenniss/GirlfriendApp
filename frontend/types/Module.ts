export interface Module {
  id: string;
  name: string;
  type: 'todo' | 'groceries' | 'bucketlist';
  createdAt: Date;
} 