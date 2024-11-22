export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  slug: string;
  thumbnail: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}