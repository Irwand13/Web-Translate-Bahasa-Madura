import { useState } from "react";
import { GitBranch, Search } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { parseMadurese, ParseTreeNode } from "../utils/madureseParser";

export function ParsingTreePage() {
  const [selectedExample, setSelectedExample] = useState(0);

  const examples = [
    { sentence: "sengko makan nase", meaning: "Saya makan nasi" },
    { sentence: "guru ngajar lesson dhibi", meaning: "Guru mengajar pelajaran di sini" },
    { sentence: "anak belajar", meaning: "Anak belajar" },
    { sentence: "murid ngaji buku bi dhibi", meaning: "Murid membaca buku di sini" },
  ];

  const currentExample = examples[selectedExample];
  const parseResult = parseMadurese(currentExample.sentence);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 bg-[#B11226]/10 rounded-full mb-4">
            <span className="text-[#B11226]">Syntax Tree Visualization</span>
          </div>
          <h1 className="mb-3 text-[#1a1a1a]">Pohon Parsing</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Visualisasi struktur hierarki gramatikal dari kalimat Bahasa Madura
          </p>
        </div>

        {/* Example Selector */}
        <Card className="bg-white shadow-sm p-6 mb-8">
          <label className="block mb-3 text-[#1a1a1a]">
            Pilih Contoh Kalimat
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setSelectedExample(index)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  selectedExample === index
                    ? "border-[#B11226] bg-[#B11226]/5"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <code className="text-[#B11226] block mb-1">
                  {example.sentence}
                </code>
                <p className="text-sm text-gray-600">{example.meaning}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Parsing Tree Visualization */}
        <Card className="bg-white shadow-lg border-t-4 border-[#B11226] p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#B11226]/10 rounded-lg flex items-center justify-center">
              <GitBranch className="h-6 w-6 text-[#B11226]" />
            </div>
            <div>
              <h2 className="text-[#1a1a1a]">Parse Tree</h2>
              <p className="text-gray-600">Struktur hierarki kalimat</p>
            </div>
          </div>

          {/* Sentence Display */}
          <div className="bg-gradient-to-r from-[#B11226]/5 to-transparent p-4 rounded-lg border-l-4 border-[#B11226] mb-8">
            <p className="text-sm text-gray-600 mb-1">Kalimat Input:</p>
            <p className="font-mono text-lg text-[#1a1a1a]">
              {currentExample.sentence}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Terjemahan: {currentExample.meaning}
            </p>
          </div>

          {/* Tree Visualization */}
          {parseResult.parseTree && (
            <div className="overflow-x-auto pb-8">
              <div className="min-w-[600px]">
                <TreeNode node={parseResult.parseTree} />
              </div>
            </div>
          )}

          {/* Tree Legend */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="mb-4 text-[#1a1a1a]">Legenda</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#B11226] rounded"></div>
                <span className="text-sm text-gray-600">Non-terminal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-[#B11226] rounded"></div>
                <span className="text-sm text-gray-600">Terminal (kata)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-[#B11226]"></div>
                <span className="text-sm text-gray-600">Edge (hubungan)</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Geser untuk zoom</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Parsing Process Explanation */}
        <Card className="bg-white shadow-sm p-6">
          <h3 className="mb-4 text-[#1a1a1a]">Proses Parsing</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#B11226] text-white rounded-full flex items-center justify-center">
                1
              </div>
              <div>
                <h4 className="mb-1 text-[#1a1a1a]">Tokenisasi</h4>
                <p className="text-gray-600">
                  Memecah kalimat menjadi token-token individual dan mengidentifikasi jenis kata dari kamus
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#B11226] text-white rounded-full flex items-center justify-center">
                2
              </div>
              <div>
                <h4 className="mb-1 text-[#1a1a1a]">Syntax Analysis</h4>
                <p className="text-gray-600">
                  Memeriksa apakah urutan token sesuai dengan grammar EBNF (minimal ada Subjek dan Predikat)
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#B11226] text-white rounded-full flex items-center justify-center">
                3
              </div>
              <div>
                <h4 className="mb-1 text-[#1a1a1a]">Tree Construction</h4>
                <p className="text-gray-600">
                  Membangun pohon parsing hierarkis dengan root "Kalimat" dan child nodes sesuai struktur SPOK
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#B11226] text-white rounded-full flex items-center justify-center">
                4
              </div>
              <div>
                <h4 className="mb-1 text-[#1a1a1a]">Translation</h4>
                <p className="text-gray-600">
                  Menerjemahkan setiap token ke Bahasa Indonesia berdasarkan kamus yang telah didefinisikan
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Tree Node Component for Visualization
function TreeNode({ node, level = 0 }: { node: ParseTreeNode; level?: number }) {
  const isRoot = level === 0;
  const isLeaf = !node.children || node.children.length === 0;

  return (
    <div className="flex flex-col items-center">
      {/* Node */}
      <div
        className={`
          px-6 py-3 rounded-lg border-2 
          ${
            isLeaf
              ? "bg-white border-[#B11226] text-[#1a1a1a]"
              : "bg-[#B11226] border-[#B11226] text-white"
          }
          ${isRoot ? "text-lg" : ""}
          shadow-md min-w-[120px] text-center
        `}
      >
        <div>{node.label}</div>
        {node.word && (
          <div className="text-xs mt-1 opacity-75">({node.word})</div>
        )}
      </div>

      {/* Children */}
      {node.children && node.children.length > 0 && (
        <>
          {/* Connecting Lines */}
          <div className="relative w-full h-12 flex items-center justify-center">
            <div className="absolute w-0.5 h-full bg-[#B11226] left-1/2 -translate-x-1/2"></div>
            {node.children.length > 1 && (
              <div
                className="absolute h-0.5 bg-[#B11226] top-0"
                style={{
                  left: `${(1 / (node.children.length + 1)) * 100}%`,
                  right: `${(1 / (node.children.length + 1)) * 100}%`,
                }}
              ></div>
            )}
            {node.children.map((_, index) => (
              <div
                key={index}
                className="absolute w-0.5 h-6 bg-[#B11226] top-0"
                style={{
                  left: `${((index + 1) / (node.children.length + 1)) * 100}%`,
                }}
              ></div>
            ))}
          </div>

          {/* Child Nodes */}
          <div className="flex gap-8 justify-center">
            {node.children.map((child, index) => (
              <TreeNode key={index} node={child} level={level + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
