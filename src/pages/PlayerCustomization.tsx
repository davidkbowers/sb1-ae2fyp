import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import CustomVideoPlayer from '../components/CustomVideoPlayer';
import { Palette, Layout, Settings } from 'lucide-react';

export default function PlayerCustomization() {
  const { theme, updateTheme } = usePlayer();

  const sampleVideoUrl = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Video Player Customization</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2 text-indigo-600" />
              Player Theme
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Skin</label>
                <select
                  value={theme.skin}
                  onChange={(e) => updateTheme({ skin: e.target.value as any })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="h-8 w-8 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                    className="h-8 w-8 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={theme.secondaryColor}
                    onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Layout className="h-5 w-5 mr-2 text-indigo-600" />
              Layout Options
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Controls Position</label>
                <select
                  value={theme.layout.controlsPosition}
                  onChange={(e) => updateTheme({ layout: { controlsPosition: e.target.value as any } })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="bottom">Bottom</option>
                  <option value="overlay">Overlay</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Title Position</label>
                <select
                  value={theme.layout.titlePosition}
                  onChange={(e) => updateTheme({ layout: { titlePosition: e.target.value as any } })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="top">Top</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-indigo-600" />
              Controls
            </h2>
            <div className="space-y-4">
              {Object.entries(theme.controls).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={value}
                    onChange={(e) => updateTheme({ controls: { [key]: e.target.checked } })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={key} className="ml-2 block text-sm text-gray-900">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Preview</h2>
            <CustomVideoPlayer
              src={sampleVideoUrl}
              title="Sample Video"
              poster="https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&w=800&q=80"
            />
          </div>
        </div>
      </div>
    </div>
  );
}