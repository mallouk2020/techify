'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface HeroData {
  id: string;
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  isActive: boolean;
}

export default function HeroSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [formData, setFormData] = useState({
    badge: 'FEATURED PRODUCT',
    title: '',
    description: '',
    imageUrl: '',
    button1Text: 'BUY NOW',
    button1Link: '',
    button2Text: 'LEARN MORE',
    button2Link: '',
    stat1Value: '50K+',
    stat1Label: 'Happy Customers',
    stat2Value: '4.9',
    stat2Label: 'Rating',
    isActive: true
  });

  // Fetch hero data
  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/hero`);
      const data = await response.json();

      if (data.success) {
        setHeroData(data.data);
        setFormData({
          badge: data.data.badge,
          title: data.data.title,
          description: data.data.description,
          imageUrl: data.data.imageUrl,
          button1Text: data.data.button1Text,
          button1Link: data.data.button1Link,
          button2Text: data.data.button2Text,
          button2Link: data.data.button2Link,
          stat1Value: data.data.stat1Value,
          stat1Label: data.data.stat1Label,
          stat2Value: data.data.stat2Value,
          stat2Label: data.data.stat2Label,
          isActive: data.data.isActive
        });
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
      toast.error('Failed to load hero data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('uploadedFile', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/main-image`, {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();

      if (data.success && data.filename) {
        setFormData(prev => ({ ...prev, imageUrl: data.filename }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description || !formData.imageUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.button1Link || !formData.button2Link) {
      toast.error('Please provide links for both buttons');
      return;
    }

    setSaving(true);

    try {
      const url = heroData
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/hero/${heroData.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/hero`;

      const method = heroData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Hero section updated successfully');
        fetchHeroData();
      } else {
        toast.error(data.message || 'Failed to update hero section');
      }
    } catch (error) {
      console.error('Error updating hero:', error);
      toast.error('Failed to update hero section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hero Section Settings</h1>
        <button
          onClick={() => router.push('/admin')}
          className="btn btn-ghost"
        >
          ← Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Badge */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Badge Text</span>
          </label>
          <input
            type="text"
            name="badge"
            value={formData.badge}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="FEATURED PRODUCT"
          />
        </div>

        {/* Title */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Title *</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            placeholder="THE PRODUCT OF THE FUTURE"
            required
          />
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Description *</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full h-24"
            placeholder="Experience cutting-edge technology..."
            required
          />
        </div>

        {/* Image Upload */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Hero Image *</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
            disabled={uploading}
          />
          {uploading && (
            <span className="text-sm text-gray-500 mt-2">Uploading...</span>
          )}
          {formData.imageUrl && (
            <div className="mt-4 relative w-full h-48">
              <Image
                src={formData.imageUrl}
                alt="Hero preview"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Buttons Section */}
        <div className="divider">Buttons</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Button 1 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Button 1 Text</span>
            </label>
            <input
              type="text"
              name="button1Text"
              value={formData.button1Text}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="BUY NOW"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Button 1 Link *</span>
            </label>
            <input
              type="text"
              name="button1Link"
              value={formData.button1Link}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="/product/iphone-15-pro"
              required
            />
          </div>

          {/* Button 2 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Button 2 Text</span>
            </label>
            <input
              type="text"
              name="button2Text"
              value={formData.button2Text}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="LEARN MORE"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Button 2 Link *</span>
            </label>
            <input
              type="text"
              name="button2Link"
              value={formData.button2Link}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="/products"
              required
            />
          </div>
        </div>

        {/* Statistics Section */}
        <div className="divider">Statistics</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stat 1 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Stat 1 Value</span>
            </label>
            <input
              type="text"
              name="stat1Value"
              value={formData.stat1Value}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="50K+"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Stat 1 Label</span>
            </label>
            <input
              type="text"
              name="stat1Label"
              value={formData.stat1Label}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="Happy Customers"
            />
          </div>

          {/* Stat 2 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Stat 2 Value</span>
            </label>
            <input
              type="text"
              name="stat2Value"
              value={formData.stat2Value}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="4.9"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Stat 2 Label</span>
            </label>
            <input
              type="text"
              name="stat2Label"
              value={formData.stat2Label}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="Rating"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || uploading}
          >
            {saving ? (
              <>
                <span className="loading loading-spinner"></span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}