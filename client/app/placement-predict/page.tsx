'use client';

import { useState } from 'react';
import axios from 'axios';
import { Loader2, BrainCircuit } from 'lucide-react';

interface PredictionResponse {
  prediction: number;
  probability: number;
}

export default function PlacementPrediction() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    cgpa: 7.5,
    internships: 1,
    projects: 2,
    certifications: 2,
    aptitude: 70,
    softskills: 70,
    extracurricular: 1,
    placement_training: 1,
  });

  const [result, setResult] =
    useState<PredictionResponse | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: Number(e.target.value),
    }));
  };

  const handlePredict = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_MODEL_API_URL}/predict`,
        formData,
        {
          withCredentials: true
        }
      );

      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      label: 'CGPA',
      name: 'cgpa',
      step: 0.1,
      min: 0,
      max: 10,
    },
    {
      label: 'Internships',
      name: 'internships',
      min: 0,
      max: 10,
    },
    {
      label: 'Projects',
      name: 'projects',
      min: 0,
      max: 20,
    },
    {
      label: 'Certifications',
      name: 'certifications',
      min: 0,
      max: 20,
    },
    {
      label: 'Extracurricular',
      name: 'extracurricular',
      min: 0,
      max: 10,
    },
    {
      label: 'Placement Training',
      name: 'placement_training',
      min: 0,
      max: 1,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-13 px-4 pb-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-4">
          <BrainCircuit
            className="mx-auto mb-4"
            size={48}
          />

          <h1 className="text-2xl font-bold">
            Placement Prediction
          </h1>

          <p className="text-zinc-400 mt-2 text-sm">
            Predict your placement chances using
            Machine Learning.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold mb-3">
              Student Profile
            </h2>
            <div className="grid gap-2 grid-cols-2">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block mb-2 text-sm text-zinc-300">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    name={field.name}
                    value={formData[field.name as keyof typeof formData]}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 outline-none focus:border-blue-500" />
                </div>
              ))}

              {/* Aptitude */}
              <div>
                <label className="block mb-2">
                  Aptitude Score ({formData.aptitude})
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  name="aptitude"
                  value={formData.aptitude}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              {/* Soft Skills */}
              <div>
                <label className="block mb-2">
                  Soft Skills (
                  {formData.softskills})
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  name="softskills"
                  value={formData.softskills}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <button
                onClick={handlePredict}
                disabled={loading}
                className="mt-4 rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2
                      className="animate-spin"
                      size={18}
                    />
                    Predicting...
                  </span>
                ) : (
                  'Predict Placement'
                )}
              </button>
            </div>
          </section>

          {/* Result */}
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
            <h2 className="text-lg font-semibold mb-2">
              Prediction Result
            </h2>
            {result ? (
              <>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${result.prediction
                      ? 'text-green-500'
                      : 'text-red-500'
                      }`}
                  >
                    {result.prediction
                      ? 'PLACED'
                      : 'NOT PLACED'}
                  </div>

                  <p className="mt-2 text-sm text-zinc-400">
                    Confidence Score
                  </p>

                  <div className="mt-2 text-xl font-bold">
                    {result.probability.toFixed(2)}%
                  </div>
                </div>
              </>
            ) : (
              <div className="h-50 flex items-center justify-center text-zinc-500 cursor-pointer">
                Submit your profile to view prediction.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}