'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function ExperimentPage() {
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [qaJson, setQaJson] = useState('');
  const [promptStr, setPromptStr] = useState('');
  const [logs, setLogs] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);

  const handleExperiment = async () => {
    try {
      const res = await fetch('/api/v1/experiment/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qa_history_json: qaJson,
          provider,
          model,
          prompt_str: promptStr,
        })
      });
      const data = await res.json();
      const timestamp = new Date().toLocaleString();
      const log = {
        id: `${provider}-${model}-${Date.now()}`,
        timestamp,
        provider,
        model,
        prompt_str: data.prompt_str,
        qa_result: data.qa_result || [],
        qa_score: data.qa_score || 0,
        recipe_result: data.recipe_result || [],
        recipe_score: data.recipe_score || 0,
        average_score: data.average_score || 0
      };
      setCurrentResult(log);
      const updated = [log, ...logs];
      updated.sort((a, b) => b.average_score - a.average_score);
      setLogs(updated);
    } catch (error) {
      console.error('실험 오류:', error);
      alert('실험 중 오류가 발생했습니다. 콘솔을 확인하세요.');
    }
  };

  return (
    <div className="flex h-screen">
      {/* 좌측: 실험 기록 */}
      <div className="w-1/2 p-4 border-r overflow-auto">
        <h2 className="text-2xl font-bold mb-4">실험 기록</h2>
        {logs.length === 0 ? (
          <p className="text-muted">아직 실험 기록이 없습니다.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="mb-4 p-3 bg-card border border-border rounded-lg">
              <div className="flex justify-between text-sm text-muted mb-2">
                <span>{log.timestamp}</span>
                <span>Avg: {log.average_score.toFixed(2)}</span>
              </div>
              <div className="text-sm">
                Provider: {log.provider}, Model: {log.model}
              </div>
              {log.prompt_str && (
                <div className="text-xs text-muted mt-1">Prompt: {log.prompt_str}</div>
              )}
            </div>
          ))
        )}
      </div>
      {/* 우측: 실험 컨트롤 및 결과 */}
      <div className="w-1/2 p-4 space-y-6 overflow-auto">
        <h2 className="text-2xl font-bold">모델 실험</h2>
        <div className="space-y-4">
          {/* 프롬프트 문자열 입력 */}
          <div>
            <Label htmlFor="promptStr">프롬프트 문자열 <span className="text-red-500">*</span></Label>
            <Textarea
              id="promptStr"
              className="w-full h-20"
              value={promptStr}
              onChange={e => setPromptStr(e.target.value)}
              placeholder="직접 프롬프트를 입력해야 합니다."
              required
            />
            {promptStr.trim() === '' && (
              <div className="text-red-500 text-sm mt-1">프롬프트 문자열은 필수입니다.</div>
            )}
          </div>
          {/* 평가셋 미리보기 */}
          <div>
            <Label>평가셋 미리보기</Label>
            <pre className="bg-muted p-2 h-32 overflow-auto rounded">
              {qaJson || 'QA 히스토리 JSON을 입력하세요.'}
            </pre>
          </div>
          {/* QA JSON 입력 */}
          <div>
            <Label htmlFor="qaJsonFile">QA 히스토리 JSON 파일 업로드</Label>
            <input
              id="qaJsonFile"
              type="file"
              accept=".json,application/json"
              className="block my-2"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const text = await file.text();
                try {
                  const json = JSON.parse(text);
                  if (!Array.isArray(json)) throw new Error('JSON 배열 형식이어야 합니다.');
                  setQaJson(JSON.stringify(json, null, 2));
                } catch (err) {
                  alert('올바른 JSON 배열 파일이 아닙니다.');
                }
              }}
            />
          </div>
          {/* AI 공급자 및 모델 선택 */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label>AI 공급자</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="공급자 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">ChatGPT (OpenAI)</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>모델</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="모델 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
                  <SelectItem value="gemini-pro">gemini-pro</SelectItem>
                  <SelectItem value="claude-2">claude-2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* 실험하기 버튼 */}
          <Button onClick={handleExperiment} disabled={promptStr.trim() === ''}>실험하기</Button>
        </div>
        {/* 실험 결과 */}
        {currentResult && (
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold">QA 평가 결과</h3>
              {currentResult.qa_result.map((item, idx) => (
                <div key={idx} className="mt-2 p-2 bg-card rounded-lg border border-border">
                  <p><strong>{item.question}</strong> - {item.answer}</p>
                  <p className="text-sm text-muted">{item.reason}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-xl font-semibold">레시피 평가 결과</h3>
              {currentResult.recipe_result.map((item, idx) => (
                <div key={idx} className="mt-2 p-2 bg-card rounded-lg border border-border">
                  <p><strong>{item.criterion}</strong> - {item.score}</p>
                  <p className="text-sm text-muted">{item.comment}</p>
                </div>
              ))}
            </div>
            <div className="text-right">
              <h3 className="text-2xl font-bold">평균 점수: {currentResult.average_score.toFixed(2)}</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 