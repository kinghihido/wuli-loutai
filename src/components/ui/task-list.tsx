'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Check,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Target,
  Sparkles,
  AlertTriangle,
  ThumbsUp,
  Sun,
  Utensils,
  Atom,
  Calculator,
  Languages,
  Headphones,
  BookOpen,
  Computer,
  Coins,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 任务类型
export type TaskType = 'daily' | 'weekly' | 'custom';

// 每日任务名称
export type DailyTaskName = '早起' | '三餐';

// 每周任务名称
export type WeeklyTaskName = '物理' | '数学' | '英语' | '英语听力' | '英语阅读' | '计算概论';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  deadline: string; // 截止时间
  reward: number; // 代币奖励数量
  penalty?: number; // 未完成扣款
}

// 每日任务配置
const dailyTaskConfig: Record<DailyTaskName, { icon: React.ReactNode; color: string }> = {
  '早起': { icon: <Sun className="w-4 h-4" />, color: 'bg-amber-500' },
  '三餐': { icon: <Utensils className="w-4 h-4" />, color: 'bg-orange-500' },
};

// 每周任务配置
const weeklyTaskConfig: Record<WeeklyTaskName, { icon: React.ReactNode; color: string }> = {
  '物理': { icon: <Atom className="w-4 h-4" />, color: 'bg-blue-500' },
  '数学': { icon: <Calculator className="w-4 h-4" />, color: 'bg-purple-500' },
  '英语': { icon: <Languages className="w-4 h-4" />, color: 'bg-green-500' },
  '英语听力': { icon: <Headphones className="w-4 h-4" />, color: 'bg-pink-500' },
  '英语阅读': { icon: <BookOpen className="w-4 h-4" />, color: 'bg-teal-500' },
  '计算概论': { icon: <Computer className="w-4 h-4" />, color: 'bg-cyan-500' },
};

// 奖励选项
const rewardOptions = [100, 200, 500];

// 获取今天结束时间
const getTodayEnd = () => {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return now.toISOString();
};

// 获取本周日结束时间
const getWeekEnd = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  now.setDate(now.getDate() + daysUntilSunday);
  now.setHours(23, 59, 59, 999);
  return now.toISOString();
};

// 格式化截止时间显示
const formatDeadline = (deadline: string) => {
  const date = new Date(deadline);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  
  if (diff < 0) {
    return { text: '已过期', isExpired: true, color: 'text-red-500' };
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return { text: `${days}天后`, isExpired: false, color: 'text-green-500' };
  } else if (hours > 0) {
    return { text: `${hours}小时后`, isExpired: false, color: 'text-amber-500' };
  } else {
    return { text: '即将截止', isExpired: false, color: 'text-red-500' };
  }
};

// 生成每日任务
export const generateDailyTasks = (): Task[] => {
  const today = new Date().toISOString().split('T')[0];
  const deadline = getTodayEnd();
  
  return Object.keys(dailyTaskConfig).map((name) => ({
    id: `daily-${today}-${name}`,
    title: name,
    type: 'daily' as TaskType,
    completed: false,
    createdAt: new Date().toISOString(),
    deadline,
    reward: 100,
    penalty: 50, // 100的50%
  }));
};

// 生成每周任务
export const generateWeeklyTasks = (): Task[] => {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekId = weekStart.toISOString().split('T')[0];
  const deadline = getWeekEnd();
  
  return Object.keys(weeklyTaskConfig).map((name) => ({
    id: `weekly-${weekId}-${name}`,
    title: name,
    type: 'weekly' as TaskType,
    completed: false,
    createdAt: new Date().toISOString(),
    deadline,
    reward: 500,
    penalty: 250, // 500的50%
  }));
};

interface TaskListProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  editMode?: boolean;
  coins?: number;
}

export function TaskList({ tasks, onAddTask, onCompleteTask, onDeleteTask, editMode, coins = 0 }: TaskListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingCompleteTask, setPendingCompleteTask] = useState<Task | null>(null);
  
  const [newTask, setNewTask] = useState({
    title: '',
    reward: 100 as number,
    deadline: getTodayEnd(),
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      alert('请输入任务标题');
      return;
    }

    onAddTask({
      title: newTask.title,
      type: 'custom',
      deadline: newTask.deadline,
      reward: newTask.reward,
      penalty: Math.floor(newTask.reward * 0.5),
    });

    setNewTask({
      title: '',
      reward: 100,
      deadline: getTodayEnd(),
    });
    setShowAddModal(false);
  };

  // 点击完成任务时，先显示确认弹窗
  const handleCompleteClick = (task: Task) => {
    setPendingCompleteTask(task);
    setShowConfirmModal(true);
  };

  // 确认完成任务
  const handleConfirmComplete = () => {
    if (pendingCompleteTask) {
      onCompleteTask(pendingCompleteTask.id);
    }
    setShowConfirmModal(false);
    setPendingCompleteTask(null);
  };

  // 取消完成
  const handleCancelComplete = () => {
    setShowConfirmModal(false);
    setPendingCompleteTask(null);
  };

  // 分组任务
  const dailyTasks = tasks.filter(t => t.type === 'daily');
  const weeklyTasks = tasks.filter(t => t.type === 'weekly');
  const customTasks = tasks.filter(t => t.type === 'custom');
  
  const pendingDaily = dailyTasks.filter(t => !t.completed);
  const completedDaily = dailyTasks.filter(t => t.completed);
  const pendingWeekly = weeklyTasks.filter(t => !t.completed);
  const completedWeekly = weeklyTasks.filter(t => t.completed);
  const pendingCustom = customTasks.filter(t => !t.completed);
  const completedCustom = customTasks.filter(t => t.completed);

  return (
    <div className="space-y-6">
      {/* 顶部统计 */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          任务清单
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg border border-amber-200">
            <Coins className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-700">{coins}</span>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)} 
            size="sm"
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            自定义任务
          </Button>
        </div>
      </div>

      {/* 代币说明 */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100">
        <div className="flex items-center gap-2 text-sm text-amber-700">
          <Coins className="w-4 h-4" />
          <span>完成任务获得代币奖励，未完成将扣除奖励的50%代币</span>
        </div>
      </div>

      {/* 每日任务 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-500" />
          <h4 className="text-lg font-semibold">每日任务</h4>
          <Badge variant="secondary" className="text-xs">自动生成 · 奖励100代币</Badge>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <RefreshCw className="w-3 h-3" />
          每天0点自动重置
        </div>
        
        {pendingDaily.length > 0 && (
          <div className="space-y-2">
            {pendingDaily.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={() => handleCompleteClick(task)}
                onDelete={() => onDeleteTask(task.id)}
                showActions={editMode}
                isDaily
              />
            ))}
          </div>
        )}
        
        {pendingDaily.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            今日每日任务已全部完成！
          </div>
        )}
      </div>

      {/* 每周任务 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          <h4 className="text-lg font-semibold">每周任务</h4>
          <Badge variant="secondary" className="text-xs">自动生成 · 奖励500代币</Badge>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <RefreshCw className="w-3 h-3" />
          每周一0点自动重置
        </div>
        
        {pendingWeekly.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {pendingWeekly.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={() => handleCompleteClick(task)}
                onDelete={() => onDeleteTask(task.id)}
                showActions={editMode}
                isWeekly
              />
            ))}
          </div>
        )}
        
        {pendingWeekly.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            本周任务已全部完成！
          </div>
        )}
      </div>

      {/* 自定义任务 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-purple-500" />
          <h4 className="text-lg font-semibold">自定义任务</h4>
        </div>
        
        {pendingCustom.length > 0 && (
          <div className="space-y-2">
            {pendingCustom.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={() => handleCompleteClick(task)}
                onDelete={() => onDeleteTask(task.id)}
                showActions={editMode}
                isCustom
              />
            ))}
          </div>
        )}
        
        {completedCustom.length > 0 && (
          <div className="space-y-2 opacity-60">
            {completedCustom.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={() => onDeleteTask(task.id)}
                showActions={editMode}
                isCustom
                isCompleted
              />
            ))}
          </div>
        )}
        
        {customTasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            点击右上角"自定义任务"按钮添加任务
          </div>
        )}
      </div>

      {/* 完成确认弹窗 */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              真的认真完成了吗？
            </DialogTitle>
            <DialogDescription className="pt-2">
              请确认你已经认真完成了这个任务
            </DialogDescription>
          </DialogHeader>
          
          {pendingCompleteTask && (
            <div className="py-4">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <h4 className="font-medium mb-2">{pendingCompleteTask.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>奖励：{pendingCompleteTask.reward} 代币</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancelComplete}>
              再想想
            </Button>
            <Button onClick={handleConfirmComplete} className="gap-1">
              <ThumbsUp className="w-4 h-4" />
              确认完成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 添加任务弹窗 */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              添加自定义任务
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">任务标题 *</label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="例如：完成一篇散文创作"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">奖励代币</label>
              <div className="flex gap-2">
                {rewardOptions.map((reward) => (
                  <Button
                    key={reward}
                    variant={newTask.reward === reward ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewTask(prev => ({ ...prev, reward }))}
                    className="flex-1 gap-1"
                  >
                    <Coins className="w-3 h-3" />
                    {reward}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">截止时间</label>
              <Input
                type="datetime-local"
                value={new Date(newTask.deadline).toISOString().slice(0, 16)}
                onChange={(e) => setNewTask(prev => ({ 
                  ...prev, 
                  deadline: new Date(e.target.value).toISOString() 
                }))}
              />
            </div>

            {/* 奖励预览 */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">完成奖励</span>
                </div>
                <span className="font-bold text-amber-600">+{newTask.reward} 代币</span>
              </div>
              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <span>未完成扣款</span>
                <span className="text-red-500">-{Math.floor(newTask.reward * 0.5)} 代币</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              取消
            </Button>
            <Button onClick={handleAddTask} className="gap-1">
              <Sparkles className="w-4 h-4" />
              创建任务
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 任务项组件
interface TaskItemProps {
  task: Task;
  onComplete?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  isCompleted?: boolean;
  isDaily?: boolean;
  isWeekly?: boolean;
  isCustom?: boolean;
}

function TaskItem({ task, onComplete, onDelete, showActions, isCompleted, isDaily, isWeekly, isCustom }: TaskItemProps) {
  const deadlineInfo = formatDeadline(task.deadline);
  
  // 获取任务图标和颜色
  const getTaskStyle = () => {
    if (isDaily && dailyTaskConfig[task.title as DailyTaskName]) {
      return dailyTaskConfig[task.title as DailyTaskName];
    }
    if (isWeekly && weeklyTaskConfig[task.title as WeeklyTaskName]) {
      return weeklyTaskConfig[task.title as WeeklyTaskName];
    }
    return { icon: <Target className="w-4 h-4" />, color: 'bg-purple-500' };
  };
  
  const style = getTaskStyle();

  return (
    <div 
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border transition-all',
        isCompleted 
          ? 'bg-muted/50 border-border/50' 
          : 'bg-card border-border hover:border-primary/30',
        isWeekly && 'flex-col items-start gap-2'
      )}
    >
      <div className={cn('flex items-center gap-3 flex-1', isWeekly && 'w-full')}>
        {/* 完成按钮 */}
        {!isCompleted && (
          <button
            onClick={onComplete}
            className="w-5 h-5 rounded-full border-2 border-primary/30 hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Check className="w-3 h-3 opacity-0 hover:opacity-100 text-primary" />
          </button>
        )}
        {isCompleted && (
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
        )}

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge 
              variant="secondary" 
              className={cn('gap-1', isCompleted && 'opacity-50')}
            >
              <span className={cn('w-2 h-2 rounded-full', style.color)} />
              {task.title}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Coins className="w-3 h-3 text-amber-500" />
              <span>{task.reward}</span>
            </div>
          </div>
        </div>

        {/* 截止时间 */}
        {!isCompleted && (
          <div className={cn('flex items-center gap-1 text-xs', deadlineInfo.color)}>
            <Clock className="w-3 h-3" />
            <span>{deadlineInfo.text}</span>
          </div>
        )}

        {/* 删除按钮 */}
        {showActions && isCustom && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default TaskList;
