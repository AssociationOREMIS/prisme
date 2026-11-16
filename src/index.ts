import './styles/prisme.css'

// Direct re-exports, not a destructuring of `componentRegistry`: a bundler can drop the
// components an app does not import (`export const { ... } = componentRegistry` kept them all).
export { PrAccordion } from './components/molecules/Accordion'
export { PrAlert } from './components/atoms/Alert'
export { PrAlertDialog } from './components/molecules/AlertDialog'
export { PrAppShell } from './components/layouts/AppShell'
export { PrAvatar } from './components/atoms/Avatar'
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
export { PrErrorSummary } from './components/atoms/ErrorSummary'
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
export { PrSidebar, PrSidebarItem, PrSidebarSection, PrSidebarSubItem } from './components/molecules/Sidebar'
export { PrSkeleton } from './components/atoms/Skeleton'
export { PrSortableList } from './components/molecules/SortableList'
export { PrSlider } from './components/atoms/Slider'
export { PrSpinner } from './components/atoms/Spinner'
export { PrStepper } from './components/molecules/Stepper'
export { PrSwitch } from './components/atoms/Switch'
export { PrTable } from './components/atoms/Table'
export { PrTabs } from './components/molecules/Tabs'
export { PrTagInput } from './components/atoms/TagInput'
export { PrTextarea } from './components/atoms/Textarea'
export { PrThemeToggle } from './components/molecules/ThemeToggle'
export { PrToast, PrToastProvider, usePrToast } from './components/molecules/Toast'
export type { PrToastOptions } from './components/molecules/Toast'
export { PrToggle } from './components/atoms/Toggle'
export { PrToggleGroup } from './components/molecules/ToggleGroup'
export { PrTooltip } from './components/molecules/Tooltip'
export { PrTypography } from './components/atoms/Typography'
export { PrPageHeader } from './components/layouts/PageHeader'
export { PrDescriptionItem, PrDescriptionList } from './components/molecules/DescriptionList'

export { PrVisuallyHidden } from './components/atoms/VisuallyHidden'
export { PrStatusDot } from './components/atoms/StatusDot'
export { PrFab } from './components/molecules/Fab'
export { PrQuickExit } from './components/molecules/QuickExit'
export { PrEmergencyContacts } from './components/molecules/EmergencyContacts'
export { PrChatThread } from './components/molecules/ChatThread'
export { PrChatMessage } from './components/molecules/ChatMessage'
export { PrTypingIndicator } from './components/molecules/TypingIndicator'
export { PrChatComposer } from './components/molecules/ChatComposer'
export { PrStack } from './components/atoms/Stack'
export { PrGrid } from './components/atoms/Grid'
export { PrFeature } from './components/molecules/Feature'
export { PrLinkList } from './components/molecules/LinkList'
export { PrContainer } from './components/layouts/Container'
export { PrHero } from './components/layouts/Hero'
export { PrBand } from './components/layouts/Band'
export { PrPanel } from './components/layouts/Panel'
export { PrFooter } from './components/layouts/Footer'
// Brand icons for social links (Lucide has none), usable as the `icon` of PrButton or PrFooter's socials.
export {
  PrIconDiscord,
  PrIconFacebook,
  PrIconInstagram,
  PrIconLinkedin,
  PrIconTiktok,
  PrIconX,
  PrIconYoutube,
} from './icons/brand'
export type { PrBrandIconProps } from './icons/brand'
export { PrChatWindow } from './components/molecules/ChatWindow'
export type {
  PrAccordionItem,
  PrAccordionProps,
  PrAlertDialogProps,
  PrAlertProps,
  PrAppShellProps,
  PrAvatarProps,
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
  PrDataTableRowAction,
  PrDataTableSort,
  PrDatePickerProps,
  PrDialogProps,
  PrDividerProps,
  PrDropdownMenuProps,
  PrErrorSummaryProps,
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
  PrSidebarSectionProps,
  PrSidebarSubItemProps,
  PrSortableListChange,
  PrSortableListProps,
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
  PrVisuallyHiddenProps,
  PrStatusDotProps,
  PrFabProps,
  PrQuickExitProps,
  PrEmergencyContact,
  PrEmergencyContactsProps,
  PrChatThreadProps,
  PrChatMessageProps,
  PrTypingIndicatorProps,
  PrChatComposerProps,
  PrStackProps,
  PrSpaceStep,
  PrGridProps,
  PrFeatureProps,
  PrLinkListProps,
  PrLinkListItem,
  PrLinkListTag,
  PrContainerProps,
  PrHeroProps,
  PrBandProps,
  PrPanelProps,
  PrFooterProps,
  PrFooterColumn,
  PrFooterLink,
  PrFooterSocial,
  PrChatWindowProps,
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
  PrFormError,
  PrFormOptions,
  PrFormReturn,
  PrFormSchema,
  PrValidationRule,
} from './composables/usePrForm'

export { mountPrismeIsolated } from './composables/mountPrismeIsolated'
export { getPrSkeletonStyles, prSkeletonFor } from './skeleton'
export type {
  PrIsolatedMountOptions,
  PrIsolatedMountResult,
  PrIsolatedTheme,
} from './composables/mountPrismeIsolated'
