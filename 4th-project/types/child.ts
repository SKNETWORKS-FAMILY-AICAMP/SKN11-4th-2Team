export interface Child {
  id: number;
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  profileImage?: string;
}

export interface ChildrenResponse {
  success: boolean;
  data: Child[];
}
