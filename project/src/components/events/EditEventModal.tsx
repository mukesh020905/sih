import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import axios from 'axios';

interface EditEventForm {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxAttendees: number;
  category: string;
  image: string;
  isVirtual: boolean;
  rsvp: boolean;
}

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventUpdate: (data: EditEventForm) => void;
  event: any;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({ isOpen, onClose, onEventUpdate, event }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<EditEventForm>();
  const [imageUpload, setImageUpload] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (event) {
      setValue('title', event.title);
      setValue('description', event.description);
      setValue('date', new Date(event.date).toISOString().split('T')[0]);
      setValue('time', event.time);
      setValue('location', event.location);
      setValue('maxAttendees', event.maxAttendees);
      setValue('category', event.category);
      setValue('image', event.image);
      setValue('isVirtual', event.isVirtual);
      setValue('rsvp', event.rsvp);
    }
  }, [event, setValue]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: EditEventForm) => {
    let imageUrl = data.image;
    if (imageUpload && imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      try {
        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:5000/api/events/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token || '',
          },
        });
        imageUrl = res.data;
      } catch (err) {
        console.error('Error uploading image:', err);
        return;
      }
    }

    onEventUpdate({ ...data, image: imageUrl });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
        <div className="max-h-[80vh] overflow-y-auto pr-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-8">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
              <input
                type="text"
                id="title"
                {...register('title', { required: 'Title is required' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                rows={4}
                {...register('description', { required: 'Description is required' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  id="date"
                  {...register('date', { required: 'Date is required' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  id="time"
                  {...register('time', { required: 'Time is required' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                id="location"
                {...register('location', { required: 'Location is required' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700">Max Attendees</label>
                <input
                  type="number"
                  id="maxAttendees"
                  {...register('maxAttendees', { required: 'Max attendees is required', valueAsNumber: true })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.maxAttendees && <p className="text-red-500 text-xs mt-1">{errors.maxAttendees.message}</p>}
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  id="category"
                  {...register('category', { required: 'Category is required' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="Professional">Professional</option>
                  <option value="Social">Social</option>
                  <option value="Sports">Sports</option>
                  <option value="Academic">Academic</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <div className="mt-2 flex items-center">
                <input
                  type="radio"
                  id="imageUrl"
                  name="imageSource"
                  value="url"
                  checked={!imageUpload}
                  onChange={() => setImageUpload(false)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="imageUrl" className="ml-2 mr-4 block text-sm text-gray-900">URL</label>

                <input
                  type="radio"
                  id="imageUpload"
                  name="imageSource"
                  value="upload"
                  checked={imageUpload}
                  onChange={() => setImageUpload(true)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="imageUpload" className="ml-2 block text-sm text-gray-900">Upload</label>
              </div>
            </div>

            {imageUpload ? (
              <div>
                <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">Upload Image</label>
                <input
                  type="file"
                  id="imageFile"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="text"
                  id="image"
                  {...register('image')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="isVirtual"
                  type="checkbox"
                  {...register('isVirtual')}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isVirtual" className="ml-2 block text-sm text-gray-900">Virtual Event</label>
              </div>
              <div className="flex items-center">
                <input
                  id="rsvp"
                  type="checkbox"
                  {...register('rsvp')}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="rsvp" className="ml-2 block text-sm text-gray-900">Enable RSVP</label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Update Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};