"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { PDFDocument } from 'pdf-lib';
import { Readable } from 'stream';

// Define types for our components
interface ComponentOption {
  title: string;
  href: string;
  description: string;
  icon: JSX.Element;
}

interface SectionData {
  components: ComponentOption[];
  title: string;
}

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 15,
    color: '#333',
  },
  componentBlock: {
    marginBottom: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    marginBottom: 3,
  },
  link: {
    fontSize: 10,
    color: '#666',
  },
});

// Create PDF Document component
const PDFDocument_React = ({ sections }: { sections: SectionData[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Components Documentation</Text>
        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex}>
            <Text style={styles.subHeader}>{section.title}</Text>
            {section.components.map((component, index) => (
              <View key={`${sectionIndex}-${index}`} style={styles.componentBlock}>
                <Text style={styles.title}>{component.title}</Text>
                <Text style={styles.description}>{component.description}</Text>
                <Text style={styles.link}>Route: {component.href}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

// Function to convert NodeJS.ReadableStream to Uint8Array
async function nodeStreamToUint8Array(stream: NodeJS.ReadableStream): Promise<Uint8Array> {
  const chunks: Buffer[] = [];
  
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => {
      const result = Buffer.concat(chunks);
      resolve(new Uint8Array(result));
    });
  });
}

// Main function to create and merge PDFs
export async function createPDF(
  componentsList: ComponentOption[][],
  fileName: string,
  sectionTitles: string[],
  existingPdfPath: string
): Promise<void> {
  try {
    // Create sections data
    const sections: SectionData[] = componentsList.map((components, index) => ({
      components,
      title: sectionTitles[index]
    }));

    // Generate new PDF from components
    const newPdfDoc = <PDFDocument_React sections={sections} />;
    const pdfStream = await pdf(newPdfDoc).toBuffer();
    const pdfData = await nodeStreamToUint8Array(pdfStream);

    // Load the existing PDF
    const existingPdfResponse = await fetch(existingPdfPath);
    const existingPdfArrayBuffer = await existingPdfResponse.arrayBuffer();
    const existingPdfDoc = await PDFDocument.load(existingPdfArrayBuffer);

    // Create a new PDF document for merging
    const mergedPdf = await PDFDocument.create();

    // Copy pages from existing PDF
    const existingPages = await mergedPdf.copyPages(existingPdfDoc, existingPdfDoc.getPageIndices());
    existingPages.forEach(page => mergedPdf.addPage(page));

    // Load and copy pages from new PDF
    const newPdfDoc_lib = await PDFDocument.load(pdfData);
    const newPages = await mergedPdf.copyPages(newPdfDoc_lib, newPdfDoc_lib.getPageIndices());
    newPages.forEach(page => mergedPdf.addPage(page));

    // Save the merged PDF
    const mergedPdfBytes = await mergedPdf.save();

    // Create a download link and trigger download
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create PDF: ${error.message}`);
    }
    throw new Error('Failed to create PDF: Unknown error');
  }
}

// Component to trigger PDF generation and download
export const PDFDownloadButton: React.FC<{
  componentsList: ComponentOption[][];
  fileName: string;
  sectionTitles: string[];
  existingPdfPath: string;
}> = ({ componentsList, fileName, sectionTitles, existingPdfPath }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleClick = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      await createPDF(componentsList, fileName, sectionTitles, existingPdfPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isGenerating}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating PDF...' : 'Download Merged PDF'}
      </button>
      {error && (
        <div className="text-red-500 mt-2">
          {error}
        </div>
      )}
    </div>
  );
};