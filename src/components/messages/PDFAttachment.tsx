import React from 'react';
import { FaFile, FaDownload, FaEye } from 'react-icons/fa';
import { Tooltip } from '@nextui-org/react';

interface PDFAttachmentProps {
  url: string;
  filename?: string;
}

const PDFAttachment: React.FC<PDFAttachmentProps> = ({ url, filename }) => {
  return (
    <div className="flex flex-col gap-2 p-2 border rounded-lg bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaFile className="text-red-500 text-xl" />
          <span className="text-sm font-medium truncate text-black">
            {filename || 'PDF Document'}
          </span>
        </div>
        <div className="flex gap-2">
          {/* View button with tooltip */}
          <Tooltip content="View File" placement="top">
            <button
              onClick={() => window.open(url, '_blank')}
              className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition flex items-center gap-1"
            >
              <FaEye className="text-lg" />
            </button>
          </Tooltip>

          {/* Download button with tooltip */}
          <Tooltip content="Download" placement="top">
            <a
              href={url}
              download
              className="px-3 py-1 text-green-600 hover:bg-green-50 rounded-md transition flex items-center gap-1"
            >
              <FaDownload className="text-lg" />
            </a>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default PDFAttachment;