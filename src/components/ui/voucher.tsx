'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 定向券类型
export type VoucherType = 'dongge' | 'xiaoshuo' | 'guansai' | 'zixuan';

export interface Voucher {
  id: string;
  name: string;
  type: VoucherType;
  description: string;
  createdAt: string;
  used?: boolean;
}

interface VoucherCardProps {
  voucher: Voucher;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  showAnimation?: boolean;
}

// 券类型配置
const voucherConfig = {
  dongge: {
    name: '冬戈定向券',
    gradient: 'from-amber-400 via-yellow-300 to-amber-500',
    border: 'border-amber-300',
    shadow: 'shadow-amber-400/30',
    text: 'text-amber-900',
    badge: 'bg-amber-500/90 text-white',
    icon: '🦌',
    description: '冬戈之鹿，奔跑炸裂',
  },
  xiaoshuo: {
    name: '骁朔定向券',
    gradient: 'from-slate-300 via-gray-200 to-slate-400',
    border: 'border-slate-200',
    shadow: 'shadow-slate-300/30',
    text: 'text-slate-700',
    badge: 'bg-slate-400/90 text-white',
    icon: '📖',
    description: '开卷有益，知识无价',
  },
  guansai: {
    name: '观赛定向券',
    gradient: 'from-orange-300 via-amber-200 to-orange-400',
    border: 'border-orange-200',
    shadow: 'shadow-orange-300/30',
    text: 'text-orange-800',
    badge: 'bg-orange-400/90 text-white',
    icon: '⚽',
    description: '足球不老，竞技永恒',
  },
  zixuan: {
    name: '自选券',
    gradient: 'from-purple-400 via-pink-300 to-purple-500',
    border: 'border-purple-300',
    shadow: 'shadow-purple-400/30',
    text: 'text-purple-900',
    badge: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    icon: '🎁',
    description: '自由选择心仪的定向券',
  },
};

// 尺寸配置
const sizeConfig = {
  sm: { width: 'w-28', height: 'h-36', text: 'text-xs', title: 'text-sm', icon: 'text-3xl' },
  md: { width: 'w-36', height: 'h-48', text: 'text-sm', title: 'text-base', icon: 'text-4xl' },
  lg: { width: 'w-48', height: 'h-64', text: 'text-base', title: 'text-lg', icon: 'text-5xl' },
};

export function VoucherCard({ voucher, size = 'md', onClick, disabled, showAnimation }: VoucherCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const config = voucherConfig[voucher.type];
  const sizeConf = sizeConfig[size];

  const handleClick = () => {
    if (disabled || voucher.used) return;
    setIsAnimating(true);
    onClick?.();
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'relative rounded-xl cursor-pointer transition-all duration-300 transform',
        sizeConf.width,
        sizeConf.height,
        config.border,
        'border-2',
        'shadow-lg',
        config.shadow,
        !disabled && !voucher.used && 'hover:scale-105 hover:shadow-xl',
        (disabled || voucher.used) && 'opacity-50 cursor-not-allowed',
        isAnimating && 'animate-bounce'
      )}
    >
      {/* 主卡牌 */}
      <div className={cn(
        'absolute inset-0 rounded-xl overflow-hidden',
        'bg-gradient-to-br',
        config.gradient
      )}>
        {/* 装饰图案 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-2 w-12 h-12 border-2 border-current rounded-full" />
          <div className="absolute bottom-2 right-2 w-16 h-16 border-2 border-current rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-current rotate-45" />
        </div>

        {/* 内容 */}
        <div className="relative h-full flex flex-col p-3">
          {/* 类型标签 */}
          <div className={cn(
            'self-start px-2 py-0.5 rounded-full text-xs font-medium mb-2',
            config.badge
          )}>
            定向券
          </div>

          {/* 图标区域 */}
          <div className={cn(
            'flex-1 flex items-center justify-center',
            sizeConf.icon,
            config.text,
            'opacity-80'
          )}>
            {config.icon}
          </div>

          {/* 名称 */}
          <div className={cn(
            'font-bold text-center mt-2 truncate',
            sizeConf.title,
            config.text
          )}>
            {voucher.name || config.name}
          </div>

          {/* 描述 */}
          <div className={cn(
            'text-center opacity-70 truncate',
            sizeConf.text,
            config.text
          )}>
            {voucher.description || config.description}
          </div>
        </div>
      </div>

      {/* 已使用标记 */}
      {voucher.used && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
          <span className="text-white font-bold text-lg rotate-[-20deg] border-2 border-white px-3 py-1 rounded">
            已使用
          </span>
        </div>
      )}
    </div>
  );
}

// 券包展示组件
interface VoucherPackProps {
  vouchers: Voucher[];
  onUse?: (voucher: Voucher) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function VoucherPack({ vouchers, onUse, size = 'md' }: VoucherPackProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {vouchers.map((voucher) => (
        <VoucherCard
          key={voucher.id}
          voucher={voucher}
          size={size}
          onClick={() => onUse?.(voucher)}
        />
      ))}
    </div>
  );
}

// ============ 使用动画组件 ============

interface VoucherUseAnimationProps {
  voucher: Voucher | null;
  onComplete: () => void;
  onConvert?: (type: VoucherType) => void;
}

export function VoucherUseAnimation({ voucher, onComplete, onConvert }: VoucherUseAnimationProps) {
  const [phase, setPhase] = useState(0);
  const [showConvertUI, setShowConvertUI] = useState(false);
  
  if (!voucher) return null;

  const config = voucherConfig[voucher.type];

  // 自选券转化处理
  if (voucher.type === 'zixuan' && !showConvertUI) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-card rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
          <h3 className="text-xl font-bold text-center mb-6">选择要转化的定向券</h3>
          
          <div className="grid grid-cols-1 gap-3">
            <ConvertOption
              type="dongge"
              onClick={() => {
                setShowConvertUI(true);
                onConvert?.('dongge');
              }}
            />
            <ConvertOption
              type="xiaoshuo"
              onClick={() => {
                setShowConvertUI(true);
                onConvert?.('xiaoshuo');
              }}
            />
            <ConvertOption
              type="guansai"
              onClick={() => {
                setShowConvertUI(true);
                onConvert?.('guansai');
              }}
            />
          </div>
          
          <Button variant="outline" className="w-full mt-4" onClick={onComplete}>
            取消
          </Button>
        </div>
      </div>
    );
  }

  // 根据券类型显示不同动画
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative">
        {voucher.type === 'dongge' && (
          <DonggeAnimation phase={phase} setPhase={setPhase} onComplete={onComplete} />
        )}
        {voucher.type === 'xiaoshuo' && (
          <XiaoshuoAnimation phase={phase} setPhase={setPhase} onComplete={onComplete} />
        )}
        {voucher.type === 'guansai' && (
          <GuansaiAnimation phase={phase} setPhase={setPhase} onComplete={onComplete} />
        )}
        {voucher.type === 'zixuan' && showConvertUI && (
          <div className="text-center text-white text-xl animate-pulse">
            转化成功！
            <Button className="mt-4" onClick={onComplete}>完成</Button>
          </div>
        )}
      </div>
    </div>
  );
}

// 转化选项组件
function ConvertOption({ type, onClick }: { type: VoucherType; onClick: () => void }) {
  const config = voucherConfig[type];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:scale-[1.02]',
        'bg-gradient-to-r',
        config.gradient,
        config.border
      )}
    >
      <span className="text-3xl">{config.icon}</span>
      <div className="text-left">
        <div className={cn('font-bold', config.text)}>{config.name}</div>
        <div className={cn('text-sm opacity-70', config.text)}>{config.description}</div>
      </div>
    </button>
  );
}

// ============ 冬戈定向券动画（鹿爆炸） ============
function DonggeAnimation({ phase, setPhase, onComplete }: { 
  phase: number; 
  setPhase: (p: number) => void; 
  onComplete: () => void;
}) {
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // 开始跑
      setTimeout(() => setPhase(2), 2000),  // 爆炸
      setTimeout(() => setPhase(3), 3000),  // 显示文字
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-80 h-80 relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-300">
      {/* 跑动的鹿 */}
      {phase < 2 && (
        <div 
          className={cn(
            'absolute text-6xl transition-all duration-[1500ms] ease-linear',
            phase === 0 ? 'left-0' : 'left-[calc(100%-3rem)]'
          )}
          style={{ top: '40%' }}
        >
          <span className={cn(phase >= 1 && 'animate-[run_0.3s_ease-in-out_infinite]')}>
            🦌
          </span>
        </div>
      )}
      
      {/* 爆炸效果 */}
      {phase >= 2 && phase < 3 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-8xl animate-ping">💥</div>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-orange-500 rounded-full animate-ping"
              style={{
                transform: `rotate(${i * 45}deg) translateY(-60px)`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* 结果文字 */}
      {phase >= 3 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-900">
          <div className="text-4xl mb-2">🦌💨💥</div>
          <div className="text-xl font-bold">冬戈已炸！</div>
          <Button className="mt-4" onClick={onComplete}>完成</Button>
        </div>
      )}
      
      {/* 底部说明 */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-amber-800 text-sm">
        冬戈定向券
      </div>
    </div>
  );
}

// ============ 骁朔定向券动画（开卷有益） ============
function XiaoshuoAnimation({ phase, setPhase, onComplete }: { 
  phase: number; 
  setPhase: (p: number) => void; 
  onComplete: () => void;
}) {
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // 书出现
      setTimeout(() => setPhase(2), 1500),  // 书翻开
      setTimeout(() => setPhase(3), 2500),  // 显示文字
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-80 h-80 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-300 to-gray-200">
      {/* 书本 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {phase >= 1 && (
          <div className={cn(
            'text-7xl transition-transform duration-500',
            phase < 2 ? 'scale-100' : 'scale-110'
          )}>
            {phase < 2 ? '📕' : '📖'}
          </div>
        )}
      </div>
      
      {/* 光芒效果 */}
      {phase >= 2 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-yellow-200 rounded-full opacity-50 animate-ping" />
        </div>
      )}
      
      {/* 开卷有益文字 */}
      {phase >= 3 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl mb-4">📖</div>
          <div className="text-2xl font-bold text-slate-700 writing-vertical">开卷有益</div>
          <Button className="mt-6" onClick={onComplete}>完成</Button>
        </div>
      )}
      
      {/* 底部说明 */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-slate-600 text-sm">
        骁朔定向券
      </div>
    </div>
  );
}

// ============ 观赛定向券动画（队徽登场） ============
function GuansaiAnimation({ phase, setPhase, onComplete }: { 
  phase: number; 
  setPhase: (p: number) => void; 
  onComplete: () => void;
}) {
  const teams = [
    { name: '诺丁汉森林', color: 'from-red-600 to-red-800', icon: '🌲' },
    { name: '马德里竞技', color: 'from-red-500 to-white', icon: '🔴⚪' },
    { name: '摩纳哥', color: 'from-red-600 to-white', icon: '🔶⚪' },
    { name: '森林狼', color: 'from-blue-900 to-green-700', icon: '🐺' },
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1700),
      setTimeout(() => setPhase(4), 2400),
      setTimeout(() => setPhase(5), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-96 h-80 relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-300 to-amber-200">
      {/* 队徽依次登场 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {teams.map((team, index) => (
          <div
            key={index}
            className={cn(
              'absolute transition-all duration-500',
              phase > index ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            )}
            style={{ 
              left: `${15 + index * 22}%`,
              top: '35%',
            }}
          >
            <div className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center text-2xl',
              'bg-gradient-to-br',
              team.color,
              'shadow-lg'
            )}>
              {team.icon}
            </div>
            <div className="text-xs text-center mt-1 font-medium text-orange-900">
              {team.name}
            </div>
          </div>
        ))}
      </div>
      
      {/* 足球不老 竞技永恒 */}
      {phase >= 5 && (
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
          <div className="text-3xl mb-2 animate-bounce">⚽</div>
          <div className="text-2xl font-bold text-orange-900 text-center leading-relaxed">
            足球不老<br/>竞技永恒
          </div>
          <Button className="mt-4" onClick={onComplete}>完成</Button>
        </div>
      )}
      
      {/* 底部说明 */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-orange-800 text-sm">
        观赛定向券
      </div>
    </div>
  );
}

export default VoucherCard;
