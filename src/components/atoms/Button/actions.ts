import {
  ArrowLeft,
  Ban,
  Check,
  Copy,
  CopyPlus,
  Download,
  Ellipsis,
  Eye,
  History,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from '@lucide/vue'
import type { Component } from 'vue'
import { prMessagesFr } from '../../../i18n/messages'

export interface PrButtonActionPreset {
  icon: Component
  label: string
  tone?: 'danger'
}

export type PrButtonAction =
  | 'view' | 'edit' | 'delete' | 'remove' | 'reject' | 'approve' | 'add' | 'duplicate'
  | 'copy' | 'download' | 'upload' | 'search' | 'history' | 'back' | 'more'

/**
 * Usual actions, ready to use: `<pr-button action="edit" href="...">` is a discreet square button
 * with a pencil, named and tooltipped « Modifier ». `label`, `icon`, `tone` and `variant` still
 * override the preset, and a label in the slot shows the icon before it. The label shown comes
 * from the app's messages (`actions`), French by default as here.
 */
export const prButtonActions = {
  view: { icon: Eye, label: prMessagesFr.actions.view },
  edit: { icon: Pencil, label: prMessagesFr.actions.edit },
  delete: { icon: Trash2, label: prMessagesFr.actions.delete, tone: 'danger' },
  remove: { icon: X, label: prMessagesFr.actions.remove, tone: 'danger' },
  reject: { icon: Ban, label: prMessagesFr.actions.reject, tone: 'danger' },
  approve: { icon: Check, label: prMessagesFr.actions.approve },
  add: { icon: Plus, label: prMessagesFr.actions.add },
  duplicate: { icon: CopyPlus, label: prMessagesFr.actions.duplicate },
  copy: { icon: Copy, label: prMessagesFr.actions.copy },
  download: { icon: Download, label: prMessagesFr.actions.download },
  upload: { icon: Upload, label: prMessagesFr.actions.upload },
  search: { icon: Search, label: prMessagesFr.actions.search },
  history: { icon: History, label: prMessagesFr.actions.history },
  back: { icon: ArrowLeft, label: prMessagesFr.actions.back },
  more: { icon: Ellipsis, label: prMessagesFr.actions.more },
} satisfies Record<PrButtonAction, PrButtonActionPreset>
