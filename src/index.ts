import './styles/prisme.css'

// Direct re-exports, not a destructuring of `componentRegistry`: a bundler can drop the
// components an app does not import (`export const { ... } = componentRegistry` kept them all).
export { PrAccordion } from './components/molecules/Accordion'
export { PrAlert } from './components/atoms/Alert'
export { PrAlertDialog } from './components/molecules/AlertDialog'
export { PrAppShell } from './components/layouts/AppShell'
export { PrBadge } from './components/atoms/Badge'
export { PrButton, prButtonActions } from './components/atoms/Button'
export { PrCalendar } from './components/molecules/Calendar'
export { PrCard } from './components/atoms/Card'
export { PrCarousel } from './components/molecules/Carousel'
export { PrCheckbox } from './components/atoms/Checkbox'
export { PrCollapsible } from './components/molecules/Collapsible'
export { PrCombobox } from './components/molecules/Combobox'
export { PrCommand } from './components/molecules/Command'
export { PrDataTable } from './components/molecules/DataTable'
export { PrDatePicker } from './components/molecules/DatePicker'
export { PrDialog } from './components/molecules/Dialog'
export { PrDivider } from './components/atoms/Divider'
export { PrDropdownMenu } from './components/molecules/DropdownMenu'
export { PrFileUpload } from './components/molecules/FileUpload'
export { PrHoverCard } from './components/molecules/HoverCard'
export { PrInput } from './components/atoms/Input'
export { PrLabel } from './components/atoms/Label'
export { PrListItem } from './components/molecules/ListItem'
export { PrNavbar, PrNavbarUserMenu } from './components/layouts/Navbar'
export { PrNavigationMenu } from './components/molecules/NavigationMenu'
export { PrNumberInput } from './components/atoms/NumberInput'
export { PrPagination } from './components/molecules/Pagination'
export { PrPopover } from './components/molecules/Popover'
export { PrProgress } from './components/atoms/Progress'
export { PrRadioGroup } from './components/molecules/RadioGroup'
export { PrScrollArea } from './components/molecules/ScrollArea'
export { PrSelect } from './components/molecules/Select'
export { PrSheet } from './components/molecules/Sheet'
export { PrSidebar, PrSidebarItem, PrSidebarSubItem } from './components/molecules/Sidebar'
export { PrSkeleton } from './components/atoms/Skeleton'
export { PrSlider } from './components/atoms/Slider'
export { PrSpinner } from './components/atoms/Spinner'
export { PrStepper } from './components/molecules/Stepper'
export { PrSwitch } from './components/atoms/Switch'
export { PrTable } from './components/atoms/Table'
export { PrTabs } from './components/molecules/Tabs'
export { PrTagInput } from './components/atoms/TagInput'
export { PrTextarea } from './components/atoms/Textarea'
export { PrThemeToggle } from './components/molecules/ThemeToggle'
export { PrToast, PrToastProvider } from './components/molecules/Toast'
export { PrToggle } from './components/atoms/Toggle'
export { PrToggleGroup } from './components/molecules/ToggleGroup'
export { PrTooltip } from './components/molecules/Tooltip'
export { PrTypography } from './components/atoms/Typography'
export { PrPageHeader } from './components/layouts/PageHeader'
export { PrDescriptionItem, PrDescriptionList } from './components/molecules/DescriptionList'

export type {
  PrAccordionItem,
  PrAccordionProps,
  PrAlertDialogProps,
  PrAlertProps,
  PrAppShellProps,
  PrBadgeProps,
  PrButtonAction,
  PrButtonActionPreset,
  PrButtonProps,
  PrCalendarProps,
  PrCardProps,
  PrCarouselItem,
  PrCarouselProps,
  PrCheckboxProps,
  PrCollapsibleProps,
  PrComboboxOption,
  PrComboboxProps,
  PrCommandItem,
  PrCommandProps,
  PrDataTableColumn,
  PrDataTableProps,
  PrDataTableSort,
  PrDatePickerProps,
  PrDialogProps,
  PrDividerProps,
  PrDropdownMenuProps,
  PrFileUploadProps,
  PrHoverCardProps,
  PrInputProps,
  PrLabelProps,
  PrListItemProps,
  PrNavbarProps,
  PrNavbarUserMenuProps,
  PrNavigationMenuItem,
  PrNavigationMenuProps,
  PrNumberInputProps,
  PrPaginationProps,
  PrPopoverProps,
  PrProgressProps,
  PrRadioGroupProps,
  PrRadioOption,
  PrRejectedFile,
  PrScrollAreaProps,
  PrSelectOption,
  PrSelectProps,
  PrSheetProps,
  PrSidebarItemProps,
  PrSidebarProps,
  PrSidebarSubItemProps,
  PrSkeletonProps,
  PrSliderProps,
  PrSpinnerProps,
  PrStep,
  PrStepperProps,
  PrSwitchProps,
  PrTab,
  PrTableProps,
  PrTabsProps,
  PrTagInputProps,
  PrTextareaProps,
  PrThemeToggleProps,
  PrToastProps,
  PrToastProviderProps,
  PrToggleGroupItem,
  PrToggleGroupProps,
  PrToggleProps,
  PrTooltipProps,
  PrTypographyProps,
  PrPageHeaderProps,
  PrDescriptionItemProps,
  PrDescriptionListItem,
  PrDescriptionListProps,
} from './components/registry'

export { fromLaravelPaginator } from './components/registry'
export type { PrFieldError } from './components/fieldError'
export type {
  LaravelFlatPaginatorResponse,
  LaravelPaginatorMeta,
  LaravelPaginatorResponse,
  LaravelWrappedPaginatorResponse,
  PrServerTableState,
} from './components/registry'

export { default, Prisme } from './plugin'
export type { PrismeOptions } from './plugin'

export { prMessagesFr } from './i18n/messages'
export { prMessagesEn } from './i18n/en'
export { usePrMessages } from './i18n/context'
export type { PrMessages } from './i18n/messages'
export type { PrMessagesOverride } from './i18n/context'

export {
  applyPrThemePreference,
  getPrThemeInitScript,
  PR_THEME_STORAGE_KEY,
  setPrTheme,
  togglePrTheme,
  usePrTheme,
} from './composables/usePrTheme'
export type { PrResolvedTheme, PrTheme } from './composables/usePrTheme'

export {
  email,
  fromLaravelErrors,
  max,
  maxLength,
  min,
  minLength,
  pattern,
  required,
  usePrForm,
} from './composables/usePrForm'
export type {
  LaravelValidationErrors,
  PrFieldConfig,
  PrFormReturn,
  PrFormSchema,
  PrValidationRule,
} from './composables/usePrForm'

export { mountPrismeIsolated } from './composables/mountPrismeIsolated'
export type {
  PrIsolatedMountOptions,
  PrIsolatedMountResult,
  PrIsolatedTheme,
} from './composables/mountPrismeIsolated'
