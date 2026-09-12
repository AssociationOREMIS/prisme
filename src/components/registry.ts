import type { Component } from 'vue'

import { PrAccordion } from './molecules/Accordion'
export type { PrAccordionItem, PrAccordionProps } from './molecules/Accordion'

import { PrAlert } from './atoms/Alert'
export type { PrAlertProps } from './atoms/Alert'

import { PrAlertDialog } from './molecules/AlertDialog'
export type { PrAlertDialogProps } from './molecules/AlertDialog'

import { PrBadge } from './atoms/Badge'
export type { PrBadgeProps } from './atoms/Badge'

import { PrButton } from './atoms/Button'
export type { PrButtonProps } from './atoms/Button'

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
export type { PrDataTableColumn, PrDataTableProps, PrDataTableSort } from './molecules/DataTable'
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

import { PrDialog } from './molecules/Dialog'
export type { PrDialogProps } from './molecules/Dialog'

import { PrHoverCard } from './molecules/HoverCard'
export type { PrHoverCardProps } from './molecules/HoverCard'

import { PrNavbar } from './layouts/Navbar'
export type { PrNavbarProps } from './layouts/Navbar'

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

import { PrRichTextEditor } from './molecules/RichTextEditor'
export type { PrRichTextEditorProps } from './molecules/RichTextEditor'

import { PrSelect } from './molecules/Select'
export type { PrSelectOption, PrSelectProps } from './molecules/Select'

import { PrScrollArea } from './molecules/ScrollArea'
export type { PrScrollAreaProps } from './molecules/ScrollArea'

import { PrSheet } from './molecules/Sheet'
export type { PrSheetProps } from './molecules/Sheet'

import { PrSkeleton } from './atoms/Skeleton'
export type { PrSkeletonProps } from './atoms/Skeleton'

import { PrSidebar, PrSidebarItem, PrSidebarSubItem } from './molecules/Sidebar'
export type {
  PrSidebarItemProps,
  PrSidebarProps,
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
 */
export const componentRegistry = {
  PrAccordion,
  PrAlert,
  PrAlertDialog,
  PrAppShell,
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
  PrFileUpload,
  PrHoverCard,
  PrInput,
  PrLabel,
  PrListItem,
  PrNavbar,
  PrNavigationMenu,
  PrNumberInput,
  PrPagination,
  PrPopover,
  PrProgress,
  PrRadioGroup,
  PrRichTextEditor,
  PrScrollArea,
  PrSelect,
  PrSheet,
  PrSidebar,
  PrSidebarItem,
  PrSidebarSubItem,
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
} satisfies Record<string, Component>
