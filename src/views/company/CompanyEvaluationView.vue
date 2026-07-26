<template>
  <div class="space-y-6 max-w-4xl mx-auto pb-16 animate-fade-in font-sans">
    <!-- Google Form Top Header Card -->
    <div class="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all">
      <!-- Signature Google Form Top Accent Bar in PNC Cyan & Orange -->
      <div class="h-3.5 bg-gradient-to-r from-[#21BAEA] via-[#38C6F4] to-[#FF9933]" />

      <div class="p-6 sm:p-8 space-y-3">
        <div class="flex items-center justify-between gap-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#21BAEA]/15 text-[#21BAEA] text-xs font-semibold">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Passerelles Numériques Cambodia Official Form
          </span>
          <button
            type="button"
            class="text-xs text-[#21BAEA] hover:text-[#FF9933] font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            @click="loadEvaluations"
          >
            Refresh Records
          </button>
        </div>

        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Company Student Internship Evaluation Form
        </h1>

        <p class="text-sm text-slate-600 leading-relaxed">
          Please complete this evaluation form for your assigned intern student. Selected responses and constructive feedback will be delivered directly to the student's assigned PNC Tutor.
        </p>

        <p class="text-xs text-red-500 font-semibold pt-1">
          * Indicates required question
        </p>
      </div>
    </div>

    <!-- Error Banner -->
    <div
      v-if="formError"
      class="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3 shadow-xs animate-fade-in"
    >
      <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-sm font-medium text-red-800">{{ formError }}</p>
    </div>

    <!-- Success Banner -->
    <div
      v-if="successMessage"
      class="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 flex items-start gap-3 shadow-xs animate-fade-in"
    >
      <svg class="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <h4 class="text-base font-bold text-emerald-900">Evaluation Submitted Successfully!</h4>
        <p class="text-xs text-emerald-700 mt-1">
          The evaluation responses have been saved in the database and delivered to the assigned PNC Tutor.
        </p>
      </div>
    </div>

    <form class="space-y-6" @submit.prevent="submit">
      <!-- Card 1: Select Student & Tutor Recipient Notice -->
      <div class="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4 hover:border-slate-300 transition-all">
        <div>
          <label class="block text-base font-bold text-slate-900 mb-1">
            Choose Assigned Intern Student <span class="text-red-500">*</span>
          </label>
          <p class="text-xs text-slate-500 mb-3">Select the PNC student assigned to your company for evaluation.</p>

          <select
            v-model="form.student_id"
            class="w-full rounded-2xl border border-slate-200 bg-[#EDF4FE]/60 px-4 py-3.5 text-sm text-slate-900 font-semibold focus:border-[#21BAEA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#21BAEA]/20 transition-all cursor-pointer"
            @change="onStudentSelect"
          >
            <option :value="0" disabled>-- Select Intern Student --</option>
            <option v-for="student in students" :key="student.id" :value="student.id">
              {{ student.name || student.student_name }} ({{ student.position || 'Intern' }} - {{ student.batch || 'PNC' }})
            </option>
          </select>
        </div>

        <!-- Selected Student Profile & Assigned Tutor Card -->
        <div v-if="selectedStudent" class="rounded-2xl border border-blue-100 bg-[#F4F9FF] p-4.5 space-y-3 transition-all animate-fade-in">
          <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-blue-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#21BAEA] text-white flex items-center justify-center font-bold text-base shadow-xs">
                {{ (selectedStudent.name || selectedStudent.student_name || 'S').charAt(0) }}
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-900">{{ selectedStudent.name || selectedStudent.student_name }}</h4>
                <p class="text-xs text-slate-500">{{ selectedStudent.email || selectedStudent.student_email || 'pnc.student@passerellesnumeriques.org' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-lg bg-blue-100 text-[#21BAEA] text-xs font-semibold">
                {{ selectedStudent.position || 'General Intern' }}
              </span>
              <span class="px-3 py-1 rounded-lg bg-amber-100 text-[#FF9933] text-xs font-semibold">
                {{ selectedStudent.batch || 'PNC Batch' }}
              </span>
            </div>
          </div>

          <!-- Recipient Tutor Notice -->
          <div class="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-slate-800">
                Assigned PNC Tutor Recipient:
                <span class="text-[#21BAEA] font-extrabold">{{ selectedStudent.tutor_name || 'Assigned PNC Tutor' }}</span>
              </p>
              <p class="text-[11px] text-slate-500 truncate">
                Evaluation results will be sent to {{ selectedStudent.tutor_name || 'the tutor' }} for academic review.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: Question 1 - Technical Competence (Multiple Choice Radio) -->
      <div class="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4 hover:border-slate-300 transition-all">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-base font-bold text-slate-900">
              1. Technical Competence & Problem Solving <span class="text-red-500">*</span>
            </h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Rate student's domain skills in {{ selectedStudent?.position || 'their major track' }} (code quality, troubleshooting, task execution).
            </p>
          </div>
          <span class="shrink-0 px-3 py-1 rounded-full bg-[#21BAEA]/15 text-[#21BAEA] text-xs font-extrabold">
            Score: {{ form.technical_skill }}
          </span>
        </div>

        <div class="space-y-2.5 pt-2">
          <label
            v-for="opt in technicalOptions"
            :key="opt.score"
            class="flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer select-none"
            :class="form.technical_skill === opt.score ? 'border-[#21BAEA] bg-[#21BAEA]/5 shadow-2xs' : 'border-slate-200/80 bg-slate-50/40 hover:bg-slate-50'"
          >
            <div class="flex items-center gap-3">
              <input
                v-model="form.technical_skill"
                type="radio"
                :value="opt.score"
                class="w-4.5 h-4.5 text-[#21BAEA] focus:ring-[#21BAEA]/30 cursor-pointer"
              />
              <div>
                <p class="text-sm font-bold text-slate-900">{{ opt.label }}</p>
                <p class="text-xs text-slate-500">{{ opt.desc }}</p>
              </div>
            </div>
            <span class="text-xs font-extrabold px-2.5 py-1 rounded-lg" :class="form.technical_skill === opt.score ? 'bg-[#21BAEA] text-white' : 'bg-slate-100 text-slate-600'">
              {{ opt.score }} pts
            </span>
          </label>
        </div>
      </div>

      <!-- Card 3: Question 2 - Communication (Multiple Choice Radio) -->
      <div class="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4 hover:border-slate-300 transition-all">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-base font-bold text-slate-900">
              2. Communication & Teamwork <span class="text-red-500">*</span>
            </h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Rate team collaboration, status reporting, active listening, and workplace communication.
            </p>
          </div>
          <span class="shrink-0 px-3 py-1 rounded-full bg-[#FF9933]/15 text-[#FF9933] text-xs font-extrabold">
            Score: {{ form.communication }}
          </span>
        </div>

        <div class="space-y-2.5 pt-2">
          <label
            v-for="opt in communicationOptions"
            :key="opt.score"
            class="flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer select-none"
            :class="form.communication === opt.score ? 'border-[#FF9933] bg-[#FF9933]/5 shadow-2xs' : 'border-slate-200/80 bg-slate-50/40 hover:bg-slate-50'"
          >
            <div class="flex items-center gap-3">
              <input
                v-model="form.communication"
                type="radio"
                :value="opt.score"
                class="w-4.5 h-4.5 text-[#FF9933] focus:ring-[#FF9933]/30 cursor-pointer"
              />
              <div>
                <p class="text-sm font-bold text-slate-900">{{ opt.label }}</p>
                <p class="text-xs text-slate-500">{{ opt.desc }}</p>
              </div>
            </div>
            <span class="text-xs font-extrabold px-2.5 py-1 rounded-lg" :class="form.communication === opt.score ? 'bg-[#FF9933] text-white' : 'bg-slate-100 text-slate-600'">
              {{ opt.score }} pts
            </span>
          </label>
        </div>
      </div>

      <!-- Card 4: Question 3 - Professionalism (Multiple Choice Radio) -->
      <div class="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4 hover:border-slate-300 transition-all">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-base font-bold text-slate-900">
              3. Professional Ethics & Responsibility <span class="text-red-500">*</span>
            </h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Rate responsibility, task ownership, meeting project deadlines, and adhering to company rules.
            </p>
          </div>
          <span class="shrink-0 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-extrabold">
            Score: {{ form.professionalism }}
          </span>
        </div>

        <div class="space-y-2.5 pt-2">
          <label
            v-for="opt in professionalismOptions"
            :key="opt.score"
            class="flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer select-none"
            :class="form.professionalism === opt.score ? 'border-emerald-500 bg-emerald-50/40 shadow-2xs' : 'border-slate-200/80 bg-slate-50/40 hover:bg-slate-50'"
          >
            <div class="flex items-center gap-3">
              <input
                v-model="form.professionalism"
                type="radio"
                :value="opt.score"
                class="w-4.5 h-4.5 text-emerald-600 focus:ring-emerald-500/30 cursor-pointer"
              />
              <div>
                <p class="text-sm font-bold text-slate-900">{{ opt.label }}</p>
                <p class="text-xs text-slate-500">{{ opt.desc }}</p>
              </div>
            </div>
            <span class="text-xs font-extrabold px-2.5 py-1 rounded-lg" :class="form.professionalism === opt.score ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'">
              {{ opt.score }} pts
            </span>
          </label>
        </div>
      </div>

      <!-- Card 5: Question 4 - Attendance (Multiple Choice Radio) -->
      <div class="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4 hover:border-slate-300 transition-all">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-base font-bold text-slate-900">
              4. Attendance, Punctuality & Learning Agility <span class="text-red-500">*</span>
            </h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Rate daily attendance, punctuality, eagerness to learn, and adaptability.
            </p>
          </div>
          <span class="shrink-0 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-extrabold">
            Score: {{ form.attendance }}
          </span>
        </div>

        <div class="space-y-2.5 pt-2">
          <label
            v-for="opt in attendanceOptions"
            :key="opt.score"
            class="flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer select-none"
            :class="form.attendance === opt.score ? 'border-purple-500 bg-purple-50/40 shadow-2xs' : 'border-slate-200/80 bg-slate-50/40 hover:bg-slate-50'"
          >
            <div class="flex items-center gap-3">
              <input
                v-model="form.attendance"
                type="radio"
                :value="opt.score"
                class="w-4.5 h-4.5 text-purple-600 focus:ring-purple-500/30 cursor-pointer"
              />
              <div>
                <p class="text-sm font-bold text-slate-900">{{ opt.label }}</p>
                <p class="text-xs text-slate-500">{{ opt.desc }}</p>
              </div>
            </div>
            <span class="text-xs font-extrabold px-2.5 py-1 rounded-lg" :class="form.attendance === opt.score ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'">
              {{ opt.score }} pts
            </span>
          </label>
        </div>
      </div>

      <!-- Card 6: Strengths (Multiple Choice Checkboxes) -->
      <div class="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4 hover:border-slate-300 transition-all">
        <div>
          <h3 class="text-base font-bold text-slate-900">
            5. Key Strengths Demonstrated (Check all that apply)
          </h3>
          <p class="text-xs text-slate-500 mt-1">Select the key positive traits observed during the internship placement.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label
            v-for="strength in availableStrengths"
            :key="strength"
            class="flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none"
            :class="selectedStrengths.includes(strength) ? 'border-[#21BAEA] bg-[#21BAEA]/10 font-bold text-[#21BAEA]' : 'border-slate-200/80 bg-slate-50/40 text-slate-700 hover:bg-slate-50'"
          >
            <input
              type="checkbox"
              :value="strength"
              :checked="selectedStrengths.includes(strength)"
              class="w-4.5 h-4.5 rounded border-slate-300 text-[#21BAEA] focus:ring-[#21BAEA]/30 cursor-pointer"
              @change="toggleStrength(strength)"
            />
            <span class="text-xs font-semibold">{{ strength }}</span>
          </label>
        </div>
      </div>

      <!-- Card 7: Growth Areas (Multiple Choice Checkboxes) -->
      <div class="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4 hover:border-slate-300 transition-all">
        <div>
          <h3 class="text-base font-bold text-slate-900">
            6. Recommended Areas for Growth (Check all that apply)
          </h3>
          <p class="text-xs text-slate-500 mt-1">Select areas where the student should continue to develop and improve.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label
            v-for="area in availableGrowthAreas"
            :key="area"
            class="flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none"
            :class="selectedGrowthAreas.includes(area) ? 'border-[#FF9933] bg-[#FF9933]/10 font-bold text-[#FF9933]' : 'border-slate-200/80 bg-slate-50/40 text-slate-700 hover:bg-slate-50'"
          >
            <input
              type="checkbox"
              :value="area"
              :checked="selectedGrowthAreas.includes(area)"
              class="w-4.5 h-4.5 rounded border-slate-300 text-[#FF9933] focus:ring-[#FF9933]/30 cursor-pointer"
              @change="toggleGrowthArea(area)"
            />
            <span class="text-xs font-semibold">{{ area }}</span>
          </label>
        </div>
      </div>

      <!-- Card 8: Paragraph Comments & Employment Recommendation -->
      <div class="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-5 hover:border-slate-300 transition-all">
        <div>
          <h3 class="text-base font-bold text-slate-900">
            7. Overall Feedback & Future Recommendation
          </h3>
          <p class="text-xs text-slate-500 mt-1">Share additional qualitative feedback or career recommendations for the student.</p>
        </div>

        <div class="space-y-3">
          <label class="block text-xs font-bold text-slate-700">Future Employment Recommendation</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <label
              v-for="rec in recommendationOptions"
              :key="rec"
              class="flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer text-xs font-medium"
              :class="recommendation === rec ? 'border-[#21BAEA] bg-[#21BAEA]/10 font-bold text-slate-900' : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-50'"
            >
              <input
                v-model="recommendation"
                type="radio"
                :value="rec"
                class="w-4 h-4 text-[#21BAEA] focus:ring-[#21BAEA]/30 cursor-pointer"
              />
              <span>{{ rec }}</span>
            </label>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-slate-700">Supervisor Detailed Comments (Paragraph Text)</label>
          <textarea
            v-model="form.feedback"
            rows="4"
            class="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[#21BAEA] focus:outline-none focus:ring-2 focus:ring-[#21BAEA]/20 transition-all"
            placeholder="Write constructive observations, project highlights, or growth advice..."
          />
        </div>

        <!-- Submit Button -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-100">
          <div class="text-xs font-bold text-slate-800">
            Calculated Overall Score:
            <span class="text-base text-[#21BAEA] font-extrabold ml-1">{{ computedOverallScore }} / 100</span>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              class="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
              @click="resetForm"
            >
              Clear Form
            </button>
            <button
              type="submit"
              class="px-8 py-3 rounded-xl bg-gradient-to-r from-[#21BAEA] to-[#00A3D9] text-white text-sm font-bold shadow-md shadow-[#21BAEA]/25 hover:shadow-lg hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
              :disabled="submitting"
            >
              {{ submitting ? 'Submitting Form...' : 'Submit Evaluation Form' }}
            </button>
          </div>
        </div>
      </div>
    </form>

    <!-- Submitted Evaluations History Section -->
    <div class="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4 pt-6 mt-10">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 class="text-lg font-bold text-slate-900">Submitted Evaluation Records</h3>
          <p class="text-xs text-slate-500">Evaluations sent to PNC Tutors & persisted in database</p>
        </div>
        <span class="px-3 py-1 rounded-full bg-[#21BAEA]/15 text-[#21BAEA] text-xs font-bold">
          {{ submittedEvaluations.length }} Submitted Forms
        </span>
      </div>

      <div v-if="loadingEvaluations" class="py-8 text-center text-slate-400 text-xs">
        Loading evaluation records...
      </div>

      <div v-else-if="!submittedEvaluations.length" class="py-8 text-center text-slate-400 text-xs">
        No evaluation forms submitted yet.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="item in submittedEvaluations"
          :key="item.id"
          class="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 space-y-3 transition-all hover:bg-white hover:shadow-md"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h4 class="text-base font-bold text-slate-900">{{ getStudentName(item) }}</h4>
              <p class="text-xs text-slate-500">Submitted on {{ formatDate(item.created_at) }}</p>
            </div>

            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-xl text-xs font-extrabold shadow-2xs" :class="scoreBadgeStyle(item.overall_score)">
                {{ item.overall_score }} / 100
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 bg-white rounded-xl border border-slate-100 text-center text-xs">
            <div class="p-2 border-r border-slate-100">
              <p class="text-slate-400 text-[10px]">Technical</p>
              <p class="font-bold text-[#21BAEA]">{{ item.technical_skill }}</p>
            </div>
            <div class="p-2 border-r border-slate-100">
              <p class="text-slate-400 text-[10px]">Communication</p>
              <p class="font-bold text-[#FF9933]">{{ item.communication }}</p>
            </div>
            <div class="p-2 border-r border-slate-100">
              <p class="text-slate-400 text-[10px]">Ethics</p>
              <p class="font-bold text-emerald-600">{{ item.professionalism }}</p>
            </div>
            <div class="p-2">
              <p class="text-slate-400 text-[10px]">Attendance</p>
              <p class="font-bold text-purple-600">{{ item.attendance }}</p>
            </div>
          </div>

          <p v-if="item.feedback" class="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-line">
            "{{ item.feedback }}"
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useCompanyStore } from '@/stores/company'
import type { CompanyEvaluationPayload, CompanyEvaluationItem, CompanyStudentItem } from '@/types/company'

const store = useCompanyStore()

const students = ref<CompanyStudentItem[]>([])
const submittedEvaluations = ref<CompanyEvaluationItem[]>([])
const submitting = ref(false)
const loading = ref(false)
const loadingEvaluations = ref(false)
const formError = ref<string | null>(null)
const successMessage = ref(false)

const selectedStrengths = ref<string[]>([
  'Good Technical Skills',
  'Responsible & Punctual',
  'Quick Learner',
])

const selectedGrowthAreas = ref<string[]>([
  'Communication & Language',
])

const recommendation = ref<string>('Highly Recommend for Employment')

const form = reactive<CompanyEvaluationPayload>({
  student_id: 0,
  technical_skill: 85,
  communication: 85,
  professionalism: 95,
  attendance: 95,
  feedback: '',
})

const technicalOptions = [
  { score: 95, label: '95 - Outstanding / Advanced', desc: 'Consistently produces high-quality work, solves technical problems independently.' },
  { score: 85, label: '85 - Proficient / Good', desc: 'Meets domain technical expectations independently with good work quality.' },
  { score: 70, label: '70 - Satisfactory / Developing', desc: 'Meets basic technical tasks with occasional guidance.' },
  { score: 50, label: '50 - Needs Improvement', desc: 'Struggles with domain tasks or requires continuous supervision.' },
]

const communicationOptions = [
  { score: 95, label: '95 - Exceptional', desc: 'Clear communicator, active listener, great team collaboration and status updates.' },
  { score: 85, label: '85 - Effective / Good', desc: 'Communicates effectively with team and supervisor, shares progress regularly.' },
  { score: 70, label: '70 - Fair', desc: 'Basic workplace communication, occasionally needs encouragement to share updates.' },
  { score: 50, label: '50 - Needs Improvement', desc: 'Difficulty expressing technical ideas or communicating with team.' },
]

const professionalismOptions = [
  { score: 95, label: '95 - Exemplary', desc: 'High integrity, strong task ownership, strictly follows company policies and deadlines.' },
  { score: 85, label: '85 - Reliable', desc: 'Responsible, meets project deadlines, respects workplace guidelines.' },
  { score: 70, label: '70 - Acceptable', desc: 'Acceptable conduct, occasionally requires reminders on task commitment.' },
  { score: 50, label: '50 - Needs Improvement', desc: 'Inconsistent task commitment or disregard for company guidelines.' },
]

const attendanceOptions = [
  { score: 95, label: '95 - Always Punctual', desc: '100% attendance, always punctual, eager to learn and take initiative.' },
  { score: 85, label: '85 - Mostly Punctual', desc: 'Good attendance record, rare minor delay with prior notice.' },
  { score: 70, label: '70 - Moderate', desc: 'Occasional tardiness, acceptable overall attendance.' },
  { score: 50, label: '50 - Needs Improvement', desc: 'Frequent unexcused tardiness or absence.' },
]

const availableStrengths = [
  'Good Technical Skills',
  'Strong Communication',
  'Quick Learner',
  'Responsible & Punctual',
  'Positive Attitude',
  'Good Problem-Solving',
  'Takes Initiative',
  'Follows Instructions Well',
]

const availableGrowthAreas = [
  'Technical Skills',
  'Communication & Language',
  'Time Management',
  'Confidence & Proactivity',
  'Attention to Detail',
]

const recommendationOptions = [
  'Highly Recommend for Employment',
  'Recommend for Employment',
  'Recommend with Minor Reservations',
  'Do Not Recommend at this Time',
]

const selectedStudent = computed(() => {
  if (!form.student_id) return null
  return students.value.find((s) => s.id === form.student_id || s.student_id === form.student_id) ?? null
})

const computedOverallScore = computed(() => {
  const sum = form.technical_skill + form.communication + form.professionalism + form.attendance
  return Math.round(sum / 4)
})

function toggleStrength(strength: string) {
  if (selectedStrengths.value.includes(strength)) {
    selectedStrengths.value = selectedStrengths.value.filter((s) => s !== strength)
  } else {
    selectedStrengths.value.push(strength)
  }
}

function toggleGrowthArea(area: string) {
  if (selectedGrowthAreas.value.includes(area)) {
    selectedGrowthAreas.value = selectedGrowthAreas.value.filter((a) => a !== area)
  } else {
    selectedGrowthAreas.value.push(area)
  }
}

function onStudentSelect() {
  formError.value = null
  successMessage.value = false
}

async function loadStudents() {
  loading.value = true
  formError.value = null
  try {
    const items = await store.fetchStudents()
    students.value = Array.isArray(items) ? items : []
    if (students.value.length > 0 && !form.student_id) {
      const first = students.value[0]
      if (first) {
        form.student_id = first.id ?? first.student_id ?? 0
      }
    }
  } catch {
    formError.value = 'Failed to load assigned intern students'
  } finally {
    loading.value = false
  }
}

async function loadEvaluations() {
  loadingEvaluations.value = true
  try {
    const items = await store.fetchEvaluations()
    submittedEvaluations.value = Array.isArray(items) ? items : []
  } catch {
    // Silently continue
  } finally {
    loadingEvaluations.value = false
  }
}

function validate(): string | null {
  if (!form.student_id) return 'Please select an assigned intern student.'
  return null
}

async function submit() {
  const validationError = validate()
  if (validationError) {
    formError.value = validationError
    return
  }

  submitting.value = true
  formError.value = null
  successMessage.value = false

  try {
    // Format full structured Q&A text payload for database text storage
    const strengthsText = selectedStrengths.value.length
      ? `Selected Strengths: ${selectedStrengths.value.join(', ')}`
      : ''
    const growthText = selectedGrowthAreas.value.length
      ? `Growth Areas: ${selectedGrowthAreas.value.join(', ')}`
      : ''
    const recText = `Recommendation: ${recommendation.value}`
    const commentsText = form.feedback ? `Comments: ${form.feedback}` : ''

    const combinedFeedback = [
      strengthsText,
      growthText,
      recText,
      commentsText,
    ].filter(Boolean).join('\n')

    // Submit evaluation score & text feedback to backend evaluations API
    await store.submitEvaluation({
      student_id: form.student_id,
      technical_skill: form.technical_skill,
      communication: form.communication,
      professionalism: form.professionalism,
      attendance: form.attendance,
      feedback: combinedFeedback,
    })

    // Also submit company feedback with strengths/growth areas to company feedback API
    try {
      await store.submitFeedback({
        student_id: form.student_id,
        message: combinedFeedback,
        strengths: selectedStrengths.value,
        improvement_areas: selectedGrowthAreas.value,
      })
    } catch {
      // Continue even if secondary feedback route is omitted
    }

    successMessage.value = true
    resetForm()
    await loadEvaluations()
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } }; message?: string }
    formError.value = err?.response?.data?.message || err?.message || 'Failed to submit evaluation'
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.technical_skill = 85
  form.communication = 85
  form.professionalism = 95
  form.attendance = 95
  form.feedback = ''
  selectedStrengths.value = ['Good Technical Skills', 'Responsible & Punctual', 'Quick Learner']
  selectedGrowthAreas.value = ['Communication & Language']
  recommendation.value = 'Highly Recommend for Employment'
  formError.value = null
}

function getStudentName(evalItem: CompanyEvaluationItem) {
  if (evalItem.student?.name) return evalItem.student.name
  const match = students.value.find((s) => s.id === evalItem.student_id || s.student_id === evalItem.student_id)
  return match?.name || match?.student_name || 'PNC Student'
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr.slice(0, 10)
  }
}

function scoreBadgeStyle(score: number) {
  if (score >= 85) return 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/20'
  if (score >= 70) return 'bg-[#21BAEA]/15 text-[#21BAEA] border border-[#21BAEA]/30'
  if (score >= 50) return 'bg-[#FF9933]/15 text-[#FF9933] border border-[#FF9933]/30'
  return 'bg-rose-500/15 text-rose-600 border border-rose-500/30'
}

onMounted(() => {
  loadStudents()
  loadEvaluations()
})
</script>
