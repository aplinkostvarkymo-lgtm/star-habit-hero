import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { childrenService } from '../services/children';
import { habitsService } from '../services/habits';
import { heroProgressService } from '../services/heroProgress';
import type { OnboardingData, AgeGroup, HabitTemplate } from '../lib/types';
import { AGE_GROUPS, AVATARS, HABIT_TEMPLATES, REWARD_TYPES, HABIT_ICONS } from '../lib/constants';

type Step = 'profile' | 'routine' | 'contract' | 'handoff';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('profile');
  const [loading, setLoading] = useState(false);
  const [createdChildId, setCreatedChildId] = useState<string>('');
  
  const [formData, setFormData] = useState<OnboardingData>({
    childName: '',
    ageGroup: '8-10',
    avatar: AVATARS[0],
    habits: HABIT_TEMPLATES['8-10'],
    rewardType: 'screen_time',
    rewardContractText: '',
  });

  const updateField = <K extends keyof OnboardingData>(
    field: K,
    value: OnboardingData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAgeGroupChange = (ageGroup: AgeGroup) => {
    updateField('ageGroup', ageGroup);
    updateField('habits', HABIT_TEMPLATES[ageGroup]);
  };

  const handleAddHabit = () => {
    updateField('habits', [...formData.habits, { title: '', icon: '⭐' }]);
  };

  const handleRemoveHabit = (index: number) => {
    updateField('habits', formData.habits.filter((_, i) => i !== index));
  };

  const handleUpdateHabit = (index: number, field: keyof HabitTemplate, value: string) => {
    const updated = [...formData.habits];
    updated[index] = { ...updated[index], [field]: value };
    updateField('habits', updated);
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Create child
      const child = await childrenService.createChild({
        user_id: user.id,
        name: formData.childName,
        age_group: formData.ageGroup,
        avatar: formData.avatar,
        reward_contract_text: formData.rewardContractText,
        reward_type: formData.rewardType,
      });

      // Create habits
      const habitsToCreate = formData.habits.map((habit, index) => ({
        child_id: child.id,
        title: habit.title,
        icon: habit.icon,
        order: index,
      }));
      await habitsService.createHabits(habitsToCreate);

      // Initialize hero progress
      await heroProgressService.createHeroProgress(child.id);

      setCreatedChildId(child.id);
      setStep('handoff');
    } catch (error) {
      console.error('Error creating child:', error);
      alert('Error creating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileStep = () => (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Child Profile</h2>
      
      <div className="space-y-6">
        <Input
          label="Child's Name or Nickname"
          value={formData.childName}
          onChange={(e) => updateField('childName', e.target.value)}
          placeholder="Enter name"
        />

        <Select
          label="Age Group"
          options={AGE_GROUPS}
          value={formData.ageGroup}
          onChange={(e) => handleAgeGroupChange(e.target.value as AgeGroup)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose Hero Avatar
          </label>
          <div className="grid grid-cols-8 gap-2">
            {AVATARS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => updateField('avatar', emoji)}
                className={`p-2 text-3xl rounded-lg transition-all ${
                  formData.avatar === emoji
                    ? 'bg-hero-primary scale-110'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setStep('routine')} disabled={!formData.childName}>
            Next: Set Up Routine
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderRoutineStep = () => (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Morning Routine Missions</h2>
      <p className="text-gray-600 mb-6">
        Customize the daily habits for {formData.childName}. These will be their morning missions!
      </p>

      <div className="space-y-3 mb-6">
        {formData.habits.map((habit, index) => (
          <div key={index} className="flex gap-2">
            <select
              value={habit.icon}
              onChange={(e) => handleUpdateHabit(index, 'icon', e.target.value)}
              className="px-3 py-2 border rounded-lg text-2xl"
            >
              {HABIT_ICONS.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
            <Input
              value={habit.title}
              onChange={(e) => handleUpdateHabit(index, 'title', e.target.value)}
              placeholder="Habit title"
            />
            <Button
              variant="danger"
              onClick={() => handleRemoveHabit(index)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <Button variant="secondary" onClick={handleAddHabit} className="mb-6">
        + Add Habit
      </Button>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => setStep('profile')}>
          Back
        </Button>
        <Button onClick={() => setStep('contract')} disabled={formData.habits.length === 0}>
          Next: Family Contract
        </Button>
      </div>
    </Card>
  );

  const renderContractStep = () => (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Family Contract</h2>
      <p className="text-gray-600 mb-6">
        Set up how completed missions will be rewarded.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Reward Type
          </label>
          <div className="grid grid-cols-1 gap-3">
            {REWARD_TYPES.map((reward) => (
              <button
                key={reward.value}
                onClick={() => updateField('rewardType', reward.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  formData.rewardType === reward.value
                    ? 'border-hero-primary bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">{reward.label}</div>
                <div className="text-sm text-gray-600">{reward.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Details
          </label>
          <textarea
            value={formData.rewardContractText}
            onChange={(e) => updateField('rewardContractText', e.target.value)}
            placeholder="Example: Complete all morning missions = 30 minutes of screen time"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hero-primary focus:border-transparent"
            rows={4}
          />
        </div>

        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => setStep('routine')}>
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.rewardContractText || loading}
          >
            {loading ? 'Creating...' : 'Create Profile'}
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderHandoffStep = () => (
    <Card className="max-w-2xl mx-auto text-center">
      <div className="py-8">
        <Avatar emoji={formData.avatar} size="xl" className="mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4">
          Profile Created! 🎉
        </h2>
        <p className="text-xl text-gray-700 mb-2">
          Show this to {formData.childName}
        </p>
        <p className="text-gray-600 mb-8">
          Time to start the hero journey!
        </p>
        <Button
          variant="success"
          size="lg"
          onClick={() => navigate(`/kid/${createdChildId}`)}
          fullWidth
          className="mb-4"
        >
          Start Mission! 🚀
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate('/parent/dashboard')}
          fullWidth
        >
          Back to Parent Dashboard
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-hero-primary mb-2">
            Star Habit Hero
          </h1>
          <p className="text-gray-600">Set up your child's hero journey</p>
        </div>

        {/* Progress indicator */}
        {step !== 'handoff' && (
          <div className="flex justify-center gap-2 mb-8">
            {['profile', 'routine', 'contract'].map((s, i) => (
              <div
                key={s}
                className={`h-2 flex-1 max-w-[100px] rounded-full ${
                  step === s ? 'bg-hero-primary' :
                  ['profile', 'routine', 'contract'].indexOf(step) > i ? 'bg-hero-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        )}

        {step === 'profile' && renderProfileStep()}
        {step === 'routine' && renderRoutineStep()}
        {step === 'contract' && renderContractStep()}
        {step === 'handoff' && renderHandoffStep()}
      </div>
    </div>
  );
};

