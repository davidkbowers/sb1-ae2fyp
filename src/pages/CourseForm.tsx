import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Course } from '../types/course';

type CourseFormData = Omit<Course, 'id' | 'createdAt' | 'updatedAt'>;

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CourseFormData>();

  const onSubmit = async (data: CourseFormData) => {
    try {
      const endpoint = id ? `/api/courses/${id}` : '/api/courses';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save course');

      toast.success(`Course ${id ? 'updated' : 'created'} successfully!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save course');
    }
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
        setValue('thumbnail', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Edit Course' : 'Create New Course'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Course Thumbnail
              </label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-2 text-center">
                  {thumbnailPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="max-h-48 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnailPreview('');
                          setValue('thumbnail', '');
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Course Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Course name is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                {...register('categoryId', { required: 'Category is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select a category</option>
                <option value="1">Web Development</option>
                <option value="2">Mobile Development</option>
                <option value="3">Data Science</option>
                <option value="4">Design</option>
              </select>
              {errors.categoryId && (
                <p className="mt-2 text-sm text-red-600">{errors.categoryId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (USD)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' }
                  })}
                  className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              {errors.price && (
                <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {id ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
}