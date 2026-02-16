'use client';

import { useState } from 'react';
import { ChevronRight, HelpCircle } from 'lucide-react';

export default function Home() {
  const [stage, setStage] = useState('welcome');
  const [formData, setFormData] = useState({});
  const [showHelp, setShowHelp] = useState({});
  const [ventureScore, setVentureScore] = useState(null);

  const calculateVenture = (data) => {
    const price = parseFloat(data.pricePoint) || 0;
    const cost = parseFloat(data.costPrice) || 0;
    const traffic = parseFloat(data.dailyTraffic) || 0;
    const conversion = parseFloat(data.conversionRate) || 0;
    const expenses = parseFloat(data.monthlyExpenses) || 0;
    const investment = parseFloat(data.initialInvestment) || 1000;

    const margin = price - cost;
    const marginPct = (margin / price * 100).toFixed(1);
    const dailyBuyers = Math.round(traffic * conversion / 100);
    const dailyProfit = dailyBuyers * margin;
    const monthlyProfit = dailyProfit * 30 - expenses;
    const paybackDays = dailyProfit > 0 ? Math.ceil(investment / dailyProfit) : 999;

    const scoreFactors = {
      margin: Math.min(marginPct / 50 * 30, 30),
      demand: Math.min(dailyBuyers / 10 * 20, 20),
      profitability: monthlyProfit > 0 ? 20 : 5,
      scalability: (traffic > 1000 && conversion > 2) ? 15 : 8,
      stability: paybackDays < 90 ? 15 : 5
    };

    const baseScore = Object.values(scoreFactors).reduce((a,b) => a+b, 0);
    const finalScore = Math.min(100, Math.max(0, baseScore));

    return {
      margin: margin.toFixed(2),
      marginPct,
      dailyBuyers,
      dailyProfit: dailyProfit.toFixed(2),
      monthlyProfit: monthlyProfit.toFixed(0),
      paybackDays,
      score: Math.round(finalScore)
    };
  };

  const getRating = (score) => {
    if (score >= 80) return { emoji: '⭐', text: 'ОТЛИЧНЫЙ', color: 'text-green-600' };
    if (score >= 60) return { emoji: '✅', text: 'ХОРОШИЙ', color: 'text-blue-600' };
    if (score >= 40) return { emoji: '🟡', text: 'ПРИЕМЛЕМЫЙ', color: 'text-yellow-600' };
    return { emoji: '❌', text: 'СОМНИТЕЛЬНЫЙ', color: 'text-red-600' };
  };

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleNext = () => {
    if (stage === 'welcome') setStage('step1');
    else if (stage === 'step1') setStage('step2');
    else if (stage === 'step2') setStage('step3');
    else if (stage === 'step3') setStage('step4');
    else if (stage === 'step4') setStage('step5');
    else if (stage === 'step5') {
      const result = calculateVenture(formData);
      setVentureScore(result);
      setStage('results');
    }
  };

  const handleBack = () => {
    const stages = ['welcome', 'step1', 'step2', 'step3', 'step4', 'step5', 'results'];
    const idx = stages.indexOf(stage);
    if (idx > 0) setStage(stages[idx - 1]);
  };

  const handleReset = () => {
    setFormData({});
    setVentureScore(null);
    setStage('welcome');
  };

  // ============ WELCOME SCREEN ============
  if (stage === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-2xl w-full text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">AI Venture Analyst</h1>
          <p className="text-lg text-gray-600 mb-2">Оцените вашу бизнес-идею за 5 минут</p>
          <p className="text-gray-500 mb-8">Как работает инвестор, но мгновенно и бесплатно</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">💰</div>
              <div className="font-semibold text-sm">Unit Economics</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">📈</div>
              <div className="font-semibold text-sm">Финмодель</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-semibold text-sm">Score</div>
            </div>
          </div>

          <button
            onClick={() => setStage('step1')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg text-lg transition"
          >
            Начать анализ →
          </button>
        </div>
      </div>
    );
  }

  // ============ RESULTS SCREEN ============
  if (stage === 'results' && ventureScore) {
    const rating = getRating(ventureScore.score);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-2xl p-10 text-center">
            <div className="text-6xl mb-4">{rating.emoji}</div>
            <div className="text-5xl font-bold mb-2">{ventureScore.score}/100</div>
            <div className={`text-2xl font-bold ${rating.color}`}>{rating.text}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-gray-600 text-sm">Маржа на товар</div>
              <div className="text-3xl font-bold text-green-600">{ventureScore.margin} EUR</div>
              <div className="text-sm text-gray-500">({ventureScore.marginPct}%)</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-gray-600 text-sm">Покупатели/день</div>
              <div className="text-3xl font-bold text-blue-600">{ventureScore.dailyBuyers}</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-gray-600 text-sm">Прибыль/месяц</div>
              <div className="text-3xl font-bold text-green-600">{ventureScore.monthlyProfit} EUR</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-gray-600 text-sm">Окупаемость</div>
              <div className="text-3xl font-bold text-blue-600">{ventureScore.paybackDays} дней</div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg"
          >
            ← Новый анализ
          </button>
        </div>
      </div>
    );
  }

  // ============ FORM STEPS ============
  const steps = {
    step1: {
      title: 'Что вы продаёте?',
      fields: [
        { name: 'productName', label: 'Описание продукта', type: 'textarea', placeholder: 'Кофе на уличном киоске' },
        { name: 'businessType', label: 'Тип бизнеса', type: 'select', 
          options: [
            { value: 'street', label: '🏪 Уличная торговля' },
            { value: 'shop', label: '🏬 Розничный магазин' },
            { value: 'online', label: '💻 Онлайн-магазин' },
            { value: 'service', label: '👨‍💼 Услуги' }
          ]
        }
      ]
    },
    step2: {
      title: 'Клиент и спрос',
      fields: [
        { name: 'targetCustomer', label: 'Портрет клиента', type: 'textarea', placeholder: 'Молодежь 18-35 лет, работающая' },
        { name: 'problemSolved', label: 'Какую проблему решаете?', type: 'textarea', placeholder: 'Нехватка времени, нужен быстрый кофе' }
      ]
    },
    step3: {
      title: 'Экономика',
      fields: [
        { name: 'pricePoint', label: 'Цена (EUR)', type: 'number', placeholder: '5' },
        { name: 'costPrice', label: 'Себестоимость (EUR)', type: 'number', placeholder: '1.5' }
      ]
    },
    step4: {
      title: 'Трафик и конверсия',
      fields: [
        { name: 'dailyTraffic', label: 'Потенциальных клиентов/день', type: 'number', placeholder: '1500' },
        { name: 'conversionRate', label: 'Конверсия (%)', type: 'number', placeholder: '2' }
      ]
    },
    step5: {
      title: 'Расходы и инвестиции',
      fields: [
        { name: 'monthlyExpenses', label: 'Месячные расходы (EUR)', type: 'number', placeholder: '500' },
        { name: 'initialInvestment', label: 'Стартовый капитал (EUR)', type: 'number', placeholder: '1000' }
      ]
    }
  };

  const currentStep = steps[stage];
  const stageNum = parseInt(stage.replace('step', '')) || 0;
  const progress = (stageNum / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Шаг {stageNum} из 5</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{width: `${progress}%`}}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">{currentStep.title}</h2>

          <div className="space-y-6 mb-8">
            {currentStep.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-gray-700 font-semibold mb-2">{field.label}</label>

                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 resize-none"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  >
                    <option value="">Выберите...</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleBack}
              disabled={stage === 'step1'}
              className="flex-1 bg-gray-400 hover:bg-gray-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition"
            >
              ← Назад
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {stage === 'step5' ? 'Анализировать' : 'Далее'} <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
