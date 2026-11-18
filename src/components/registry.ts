import type { Component } from 'vue'

import { PrAccordion } from './molecules/Accordion'
export type { PrAccordionItem, PrAccordionProps } from './molecules/Accordion'

import { PrAlert } from './atoms/Alert'
export type { PrAlertProps } from './atoms/Alert'

import { PrAlertDialog } from './molecules/AlertDialog'
export type { PrAlertDialogProps } from './molecules/AlertDialog'

import { PrAvatar } from './atoms/Avatar'
export type { PrAvatarProps } from './atoms/Avatar'

import { PrBadge } from './atoms/Badge'
export type { PrBadgeProps } from './atoms/Badge'

import { PrButton } from './atoms/Button'
export type { PrButtonAction, PrButtonActionPreset, PrButtonProps } from './atoms/Button'

import { PrCalendar } from './molecules/Calendar'
export type { PrCalendarProps } from './molecules/Calendar'

import { PrCheckbox } from './atoms/Checkbox'
export type { PrCheckboxProps } from './atoms/Checkbox'

import { PrCarousel } from './molecules/Carousel'
export type { PrCarouselItem, PrCarouselProps } from './molecules/Carousel'

import { PrCollapsible } from './molecules/Collapsible'
export type { PrCollapsibleProps } from './molecules/Collapsible'

import { PrCommand } from './molecules/Command'
export type { PrCommandItem, PrCommandProps } from './molecules/Command'

import { PrDataTable } from './molecules/DataTable'
export type { PrDataTableColumn, PrDataTableProps, PrDataTableRowAction, PrDataTableSort } from './molecules/DataTable'
export { fromLaravelPaginator } from './molecules/DataTable'
export type {
  LaravelFlatPaginatorResponse,
  LaravelPaginatorMeta,
  LaravelPaginatorResponse,
  LaravelWrappedPaginatorResponse,
  PrServerTableState,
} from './molecules/DataTable'

import { PrDatePicker } from './molecules/DatePicker'
export type { PrDatePickerProps } from './molecules/DatePicker'

import { PrAppShell } from './layouts/AppShell'
export type { PrAppShellProps } from './layouts/AppShell'

import { PrCard } from './atoms/Card'
export type { PrCardProps } from './atoms/Card'

import { PrDivider } from './atoms/Divider'
export type { PrDividerProps } from './atoms/Divider'

import { PrInput } from './atoms/Input'
export type { PrInputProps } from './atoms/Input'

import { PrLabel } from './atoms/Label'
export type { PrLabelProps } from './atoms/Label'

import { PrListItem } from './molecules/ListItem'
export type { PrListItemProps } from './molecules/ListItem'

import { PrDropdownMenu } from './molecules/DropdownMenu'
export type { PrDropdownMenuProps } from './molecules/DropdownMenu'

import { PrErrorSummary } from './atoms/ErrorSummary'
export type { PrErrorSummaryProps } from './atoms/ErrorSummary'

import { PrDialog } from './molecules/Dialog'
export type { PrDialogProps } from './molecules/Dialog'

import { PrHoverCard } from './molecules/HoverCard'
export type { PrHoverCardProps } from './molecules/HoverCard'

import { PrNavbar, PrNavbarMenu, PrNavbarUserMenu } from './layouts/Navbar'
export type { PrNavbarMenuProps, PrNavbarProps, PrNavbarUserMenuProps } from './layouts/Navbar'

import { PrNavigationMenu } from './molecules/NavigationMenu'
export type { PrNavigationMenuItem, PrNavigationMenuProps } from './molecules/NavigationMenu'

import { PrPagination } from './molecules/Pagination'
export type { PrPaginationProps } from './molecules/Pagination'

import { PrPopover } from './molecules/Popover'
export type { PrPopoverProps } from './molecules/Popover'

import { PrProgress } from './atoms/Progress'
export type { PrProgressProps } from './atoms/Progress'

import { PrRadioGroup } from './molecules/RadioGroup'
export type { PrRadioGroupProps, PrRadioOption } from './molecules/RadioGroup'

import { PrSelect } from './molecules/Select'
export type { PrSelectOption, PrSelectProps } from './molecules/Select'

import { PrScrollArea } from './molecules/ScrollArea'
export type { PrScrollAreaProps } from './molecules/ScrollArea'

import { PrSheet } from './molecules/Sheet'
export type { PrSheetProps } from './molecules/Sheet'

import { PrSortableList } from './molecules/SortableList'
export type { PrSortableListChange, PrSortableListProps } from './molecules/SortableList'

import { PrSkeleton } from './atoms/Skeleton'
export type { PrSkeletonProps } from './atoms/Skeleton'

import { PrSidebar, PrSidebarItem, PrSidebarSection, PrSidebarSubItem } from './molecules/Sidebar'
export type {
  PrSidebarItemProps,
  PrSidebarProps,
  PrSidebarSectionProps,
  PrSidebarSubItemProps,
} from './molecules/Sidebar'

import { PrThemeToggle } from './molecules/ThemeToggle'
export type { PrThemeToggleProps } from './molecules/ThemeToggle'

import { PrSpinner } from './atoms/Spinner'
export type { PrSpinnerProps } from './atoms/Spinner'

import { PrSlider } from './atoms/Slider'
export type { PrSliderProps } from './atoms/Slider'

import { PrSwitch } from './atoms/Switch'
export type { PrSwitchProps } from './atoms/Switch'

import { PrTable } from './atoms/Table'
export type { PrTableProps } from './atoms/Table'

import { PrTextarea } from './atoms/Textarea'
export type { PrTextareaProps } from './atoms/Textarea'

import { PrToast, PrToastProvider } from './molecules/Toast'
export type { PrToastProps, PrToastProviderProps } from './molecules/Toast'

import { PrToggle } from './atoms/Toggle'
export type { PrToggleProps } from './atoms/Toggle'

import { PrToggleGroup } from './molecules/ToggleGroup'
export type { PrToggleGroupItem, PrToggleGroupProps } from './molecules/ToggleGroup'

import { PrPageHeader } from './layouts/PageHeader'
export type { PrPageHeaderProps } from './layouts/PageHeader'

import { PrDescriptionItem, PrDescriptionList } from './molecules/DescriptionList'
export type { PrDescriptionItemProps, PrDescriptionListItem, PrDescriptionListProps } from './molecules/DescriptionList'

import { PrTypography } from './atoms/Typography'
export type { PrTypographyProps } from './atoms/Typography'

import { PrTooltip } from './molecules/Tooltip'
export type { PrTooltipProps } from './molecules/Tooltip'

import { PrTabs } from './molecules/Tabs'
export type { PrTab, PrTabsProps } from './molecules/Tabs'

import { PrStepper } from './molecules/Stepper'
export type { PrStep, PrStepperProps } from './molecules/Stepper'

import { PrCombobox } from './molecules/Combobox'
export type { PrComboboxOption, PrComboboxProps } from './molecules/Combobox'

import { PrFileUpload } from './molecules/FileUpload'
export type { PrFileUploadProps, PrRejectedFile } from './molecules/FileUpload'

import { PrNumberInput } from './atoms/NumberInput'
export type { PrNumberInputProps } from './atoms/NumberInput'

import { PrTagInput } from './atoms/TagInput'
export type { PrTagInputProps } from './atoms/TagInput'

/**
 * Central registry of Prisme's public components.
 *
 * Single source of truth used both by the named exports
 * (`src/index.ts`) and by the Vue plugin (`src/plugin.ts`, `app.use(Prisme)`).
 * Adding a component here is enough to make it available in both places.
 *
 * `PrRichTextEditor` is deliberately NOT listed here: it statically imports
 * tiptap and lowlight (optional peerDependencies), so anything reachable from
 * this registry would force every consumer to install them, even apps that
 * never render an editor. It lives in its own `@oremis/prisme/editor` entry
 * (`src/editor.ts`) instead.
 */
import { PrVisuallyHidden } from './atoms/VisuallyHidden'
export type { PrVisuallyHiddenProps } from './atoms/VisuallyHidden'

import { PrStatusDot } from './atoms/StatusDot'
export type { PrStatusDotProps } from './atoms/StatusDot'

import { PrFab } from './molecules/Fab'
export type { PrFabProps } from './molecules/Fab'

import { PrQuickExit } from './molecules/QuickExit'
export type { PrQuickExitProps } from './molecules/QuickExit'

import { PrEmergencyContacts } from './molecules/EmergencyContacts'
export type { PrEmergencyContact, PrEmergencyContactsProps } from './molecules/EmergencyContacts'

import { PrChatThread } from './molecules/ChatThread'
export type { PrChatThreadProps } from './molecules/ChatThread'

import { PrChatMessage } from './molecules/ChatMessage'
export type { PrChatMessageProps } from './molecules/ChatMessage'

import { PrTypingIndicator } from './molecules/TypingIndicator'
export type { PrTypingIndicatorProps } from './molecules/TypingIndicator'

import { PrChatComposer } from './molecules/ChatComposer'
export type { PrChatComposerProps } from './molecules/ChatComposer'

import { PrStack } from './atoms/Stack'
export type { PrStackProps, PrSpaceStep } from './atoms/Stack'

import { PrGrid } from './atoms/Grid'
export type { PrGridProps } from './atoms/Grid'

import { PrFeature } from './molecules/Feature'
export type { PrFeatureProps } from './molecules/Feature'

import { PrLinkList } from './molecules/LinkList'
export type { PrLinkListProps, PrLinkListItem, PrLinkListTag } from './molecules/LinkList'

import { PrContainer } from './layouts/Container'
export type { PrContainerProps } from './layouts/Container'

import { PrHero } from './layouts/Hero'
export type { PrHeroProps } from './layouts/Hero'

import { PrBand } from './layouts/Band'
export type { PrBandProps } from './layouts/Band'

import { PrPanel } from './layouts/Panel'
export type { PrPanelProps } from './layouts/Panel'

import { PrFooter } from './layouts/Footer'
export type { PrFooterProps, PrFooterColumn, PrFooterLink, PrFooterSocial } from './layouts/Footer'

import { PrChatWindow } from './molecules/ChatWindow'
export type { PrChatWindowProps } from './molecules/ChatWindow'

import { PrLink } from './atoms/Link'
export type { PrLinkProps, PrLinkTo } from './atoms/Link'

import { PrImage } from './atoms/Image'
export type { PrImageProps } from './atoms/Image'

import { PrReveal } from './atoms/Reveal'
export type { PrRevealProps } from './atoms/Reveal'

import { PrSection } from './layouts/Section'
export type { PrSectionProps } from './layouts/Section'

import { PrSplit } from './layouts/Split'
export type { PrSplitProps } from './layouts/Split'

import { PrEmbed } from './molecules/Embed'
export type { PrEmbedProps } from './molecules/Embed'

export const componentRegistry = {
  PrAccordion,
  PrAlert,
  PrAlertDialog,
  PrAppShell,
  PrAvatar,
  PrBadge,
  PrButton,
  PrCalendar,
  PrCard,
  PrCarousel,
  PrCheckbox,
  PrCollapsible,
  PrCombobox,
  PrCommand,
  PrDataTable,
  PrDatePicker,
  PrDialog,
  PrDivider,
  PrDropdownMenu,
  PrErrorSummary,
  PrFileUpload,
  PrHoverCard,
  PrInput,
  PrLabel,
  PrListItem,
  PrNavbar,
  PrNavbarUserMenu,
  PrNavigationMenu,
  PrNumberInput,
  PrPagination,
  PrPopover,
  PrProgress,
  PrRadioGroup,
  PrScrollArea,
  PrSelect,
  PrSheet,
  PrSidebar,
  PrSidebarItem,
  PrSidebarSection,
  PrSidebarSubItem,
  PrSortableList,
  PrSkeleton,
  PrSlider,
  PrSpinner,
  PrStepper,
  PrSwitch,
  PrTable,
  PrTabs,
  PrTagInput,
  PrTextarea,
  PrThemeToggle,
  PrToast,
  PrToastProvider,
  PrToggle,
  PrToggleGroup,
  PrTooltip,
  PrTypography,
  PrPageHeader,
  PrDescriptionList,
  PrDescriptionItem,
  PrVisuallyHidden,
  PrStatusDot,
  PrFab,
  PrQuickExit,
  PrEmergencyContacts,
  PrChatThread,
  PrChatMessage,
  PrTypingIndicator,
  PrChatComposer,
  PrStack,
  PrGrid,
  PrFeature,
  PrLinkList,
  PrContainer,
  PrHero,
  PrBand,
  PrPanel,
  PrFooter,
  PrChatWindow,
  PrNavbarMenu,
  PrLink,
  PrImage,
  PrReveal,
  PrSection,
  PrSplit,
  PrEmbed,
} satisfies Record<string, Component>
