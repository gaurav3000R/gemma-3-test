"use client";

import Image from "next/image";
import { SliderControl } from "./SliderControl";
import { hyperparamPresets } from "../utility/hyperparamPresets";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  temperature: number;
  setTemperature: (val: number) => void;
  maxNewTokens: number;
  setMaxNewTokens: (val: number) => void;
  topP: number;
  setTopP: (val: number) => void;
  repetitionPenalty: number;
  setRepetitionPenalty: (val: number) => void;
}

export const SettingsPanel = ({
  isOpen,
  onClose,
  temperature,
  setTemperature,
  maxNewTokens,
  setMaxNewTokens,
  topP,
  setTopP,
  repetitionPenalty,
  setRepetitionPenalty,
}: SettingsPanelProps) => {
  const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const presetKey = event.target.value;
    const preset = hyperparamPresets.find((p) => p.key === presetKey);
    if (preset) {
      setTemperature(preset.params.temperature);
      setMaxNewTokens(preset.params.max_new_tokens);
      setTopP(preset.params.top_p);
      setRepetitionPenalty(preset.params.repetition_penalty);
    }
  };

  const activePreset =
    hyperparamPresets.find(
      (p) =>
        p.params.temperature === temperature &&
        p.params.max_new_tokens === maxNewTokens &&
        p.params.top_p === topP &&
        p.params.repetition_penalty === repetitionPenalty
    )?.key || "custom";

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-full max-w-sm transform bg-background shadow-2xl transition-transform duration-300 ease-in-out will-change-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col border-r border-border">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center space-x-3">
            <Image
              src="/icons/settings.svg"
              alt="Settings"
              width={20}
              height={20}
              className="text-foreground"
            />
            <h2 className="text-lg font-semibold text-foreground">
              Model Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary"
          >
            <Image src="/icons/x.svg" alt="Close" width={20} height={20} />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          <div className="space-y-2">
            <label
              htmlFor="preset-select"
              className="text-sm font-medium text-foreground"
            >
              Preset
            </label>
            <select
              id="preset-select"
              value={activePreset}
              onChange={handlePresetChange}
              className="w-full rounded-md border border-border bg-input p-2 text-foreground"
            >
              <option value="custom" disabled>
                Custom
              </option>
              {hyperparamPresets.map((preset) => (
                <option key={preset.key} value={preset.key}>
                  {preset.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {activePreset === "custom"
                ? "Custom settings. Modify sliders below or select a preset."
                : hyperparamPresets.find((p) => p.key === activePreset)
                    ?.description}
            </p>
          </div>
          <SliderControl
            label="Temperature"
            value={temperature}
            min={0.01}
            max={1.5}
            step={0.01}
            onChange={setTemperature}
            displayValue={temperature.toFixed(2)}
          />
          <SliderControl
            label="Max New Tokens"
            value={maxNewTokens}
            min={10}
            max={2048}
            step={1}
            onChange={(v) => setMaxNewTokens(Math.round(v))}
            displayValue={String(maxNewTokens)}
          />
          <SliderControl
            label="Top-P"
            value={topP}
            min={0.1}
            max={1.0}
            step={0.01}
            onChange={setTopP}
            displayValue={topP.toFixed(2)}
          />
          <SliderControl
            label="Repetition Penalty"
            value={repetitionPenalty}
            min={1.0}
            max={2.0}
            step={0.01}
            onChange={setRepetitionPenalty}
            displayValue={repetitionPenalty.toFixed(2)}
          />
        </div>
      </div>
    </div>
  );
};
