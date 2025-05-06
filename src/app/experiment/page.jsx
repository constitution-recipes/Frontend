'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function ExperimentPage() {
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [qaJson, setQaJson] = useState('');
  const [promptStr, setPromptStr] = useState('');
  const [experiments, setExperiments] = useState([]);  // 전체 실험 리스트
  const [selectedExp, setSelectedExp] = useState(null);  // 선택된 실험
  const [loading, setLoading] = useState(false);

  const handleExperiment = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      // QA 히스토리 JSON 유효성 검사
      let basePayload;
      try {
        basePayload = JSON.parse(qaJson);
      } catch (e) {
        console.error('QA 히스토리 JSON 파싱 오류:', e);
        alert('QA 히스토리 JSON 형식이 올바르지 않습니다. 파일을 확인해주세요.');
        return;
      }
      const payload = {
        ...basePayload,
        provider,
        model,
        prompt_str: promptStr,
      };
      const res = await fetch('/api/v1/experiment/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      // HTTP 응답 상태 확인
      if (!res.ok) {
        const errorText = await res.text();
        console.error('실험 오류 (서버):', errorText);
        alert(`실험 중 서버 오류가 발생했습니다:\n${errorText}`);
        return;
      }
      // JSON 파싱 시도
      let data;
      try {
        data = await res.json();
      } catch (e) {
        const text = await res.text();
        console.error('JSON 파싱 오류:', text);
        alert(`서버 응답이 올바른 JSON이 아닙니다:\n${text}`);
        return;
      }
      // POST 응답으로 생성된 실험 전체 데이터 (TestResponse) 반환됨
      // 요청 시간 계산
      const endTime = Date.now();
      const duration = endTime - startTime; // ms
      // 메시지당 평균 시간
      const timePerMessage = data.results.length ? (duration / data.results.length) : 0;
      // 실험 데이터에 시간 필드 추가
      data.duration = duration;
      data.timePerMessage = timePerMessage;
      const newExp = data;
      // 실험 리스트에 최상단 추가
      setExperiments(prev => [newExp, ...prev]);
      // 선택된 실험 갱신
      setSelectedExp(newExp);
    } catch (error) {
      console.error('실험 오류:', error);
      alert('실험 중 오류가 발생했습니다. 콘솔을 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 마운트 시 전체 실험 기록 조회
  useEffect(() => {
    const fetchExps = async () => {
      try {
        const res = await fetch('/api/v1/experiment');
        if (!res.ok) {
          const text = await res.text();
          console.error('실험 기록 로드 서버 오류:', text);
          return;
        }
        const data = await res.json();
        console.log('Fetched experiments data:', data);
        // API가 배열을 반환하지 않을 경우 단일 객체를 배열로 감싸기
        const arr = Array.isArray(data) ? data : [data];
        setExperiments(arr);
      } catch (e) {
        console.error('실험 기록 로드 오류:', e);
      }
    };
    fetchExps();
  }, []);

  return (
    <div className="flex h-screen">
      {/* 좌측: 전체 실험 기록 */}
      <div className="w-1/4 p-4 border-r overflow-auto">
        <h2 className="text-2xl font-bold mb-4">실험 기록</h2>
        {!Array.isArray(experiments) ? (
          <p className="text-muted">실험 기록을 로드 중입니다...</p>
        ) : experiments.length === 0 ? (
          <p className="text-muted">실험 기록이 없습니다.</p>
        ) : (
          experiments.map(exp => (
            <div
              key={exp.experiment_id}
              className={`mb-3 p-3 rounded-lg cursor-pointer ${selectedExp?.experiment_id === exp.experiment_id ? 'bg-primary/10' : 'bg-card'} border border-border`}
              onClick={() => setSelectedExp(exp)}
            >
              <div className="flex justify-between text-sm mb-1">
                <span>ID: {exp.experiment_id.slice(0, 8)}</span>
                <span>Avg: {exp.overall_average.toFixed(2)}</span>
              </div>
              <div className="text-xs text-muted">Convs: {exp.results.length}</div>
            </div>
          ))
        )}
      </div>
      {/* 우측: 선택된 실험 상세 및 입력 폼 */}
      <div className="w-3/4 flex flex-col">
        <div className="flex-grow p-4 overflow-auto space-y-6">
          {selectedExp ? (
            <>
              <h2 className="text-2xl font-bold">실험: {selectedExp.experiment_id}</h2>
              <p className="text-sm text-muted">전체 평균: {selectedExp.overall_average.toFixed(2)}</p>
              <p className="text-sm text-muted">
                총 소요 시간: {selectedExp.duration ?? '-'}ms
                (메시지당: {selectedExp.timePerMessage !== undefined ? selectedExp.timePerMessage.toFixed(1) : '-'}ms)
              </p>
              {selectedExp.results.map((conv, idx) => (
                <div key={conv.conversation_id} className="p-4 bg-card rounded border border-border">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Conv ID: {conv.conversation_id}</span>
                    <span className="text-sm">Messages: {conv.messages.length}</span>
                  </div>
                  {/* 대화 내용 */}
                  <div className="bg-muted p-2 rounded mb-3">
                    {conv.messages.map((m, i) => (
                      <p key={i}><strong>{m.role}</strong>: {m.content}</p>
                    ))}
                  </div>
                  {/* QA & Recipe 평가 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold">QA 평가 (Score: {conv.qa_score.toFixed(2)})</h5>
                      {conv.qa_result.map((r, i) => (
                        <p key={i} className="text-sm">{r.question} - {r.answer}</p>
                      ))}
                    </div>
                    <div>
                      <h5 className="font-semibold">Recipe 평가 (Score: {conv.recipe_score.toFixed(2)})</h5>
                      {conv.recipe_result.map((r, i) => (
                        <p key={i} className="text-sm">{r.criterion}: {r.score}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="text-muted">왼쪽에서 실험을 선택하세요.</p>
          )}
        </div>
        {/* 입력 폼 영역 */}
        <div className="p-4 border-t space-y-4">
          <h3 className="text-xl font-bold">새 실험 실행</h3>
          {/* QA JSON, Prompt, Provider/Model 선택, 실행 버튼 */}
          <div className="space-y-2">
            <Label htmlFor="promptStr">프롬프트 문자열</Label>
            <Textarea
              id="promptStr"
              className="w-full h-20"
              value={promptStr}
              onChange={e => setPromptStr(e.target.value)}
            />
            <Label htmlFor="qaJsonFile">QA 히스토리 JSON 파일 업로드</Label>
            <input
              id="qaJsonFile"
              type="file"
              accept="application/json"
              onChange={async e => {
                const file = e.target.files?.[0]; if (!file) return;
                const text = await file.text();
                try {
                  const data = JSON.parse(text);
                  setQaJson(JSON.stringify(data, null, 2));
                } catch {
                  alert('올바른 JSON 파일을 업로드해주세요.');
                }
              }}
            />
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
            <Button onClick={handleExperiment} disabled={loading || !promptStr || !qaJson}>
              {loading ? '실행 중...' : '실험 실행'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 