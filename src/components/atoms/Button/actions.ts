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

export interface PrButtonActionPreset {
  icon: Component
  label: string
  tone?: 'danger'
}

/**
 * Usual actions, ready to use: `<pr-button action="edit" href="...">` is a discreet square button
 * with a pencil, named and tooltipped « Modifier ». `label`, `icon`, `tone` and `variant` still
 * override the preset, and a label in the slot shows the icon before it.
 */
export const prButtonActions = {
  view: { icon: Eye, label: 'Voir' },
  edit: { icon: Pencil, label: 'Modifier' },
  delete: { icon: Trash2, label: 'Supprimer', tone: 'danger' },
  remove: { icon: X, label: 'Retirer', tone: 'danger' },
  reject: { icon: Ban, label: 'Rejeter', tone: 'danger' },
  approve: { icon: Check, label: 'Valider' },
  add: { icon: Plus, label: 'Ajouter' },
  duplicate: { icon: CopyPlus, label: 'Dupliquer' },
  copy: { icon: Copy, label: 'Copier' },
  download: { icon: Download, label: 'Télécharger' },
  upload: { icon: Upload, label: 'Importer' },
  search: { icon: Search, label: 'Rechercher' },
  history: { icon: History, label: 'Historique' },
  back: { icon: ArrowLeft, label: 'Retour' },
  more: { icon: Ellipsis, label: 'Plus d’actions' },
} satisfies Record<string, PrButtonActionPreset>

export type PrButtonAction = keyof typeof prButtonActions
