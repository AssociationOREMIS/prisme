import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PrTypography } from '../../../../components/atoms/Typography'

const sampleText = 'Association OREMIS : Ensemble pour l\'inclusion'

const meta = {
  title: 'Brand/Typography',
  component: PrTypography,
  tags: ['autodocs'],
} satisfies Meta<typeof PrTypography>

export default meta
type Story = StoryObj<typeof meta>

function typographyStory(variant: NonNullable<InstanceType<typeof PrTypography>['$props']['variant']>): Story {
  return {
    render: () => ({
      components: { PrTypography },
      setup() {
        return { sampleText, variant }
      },
      template: '<PrTypography :variant="variant">{{ sampleText }}</PrTypography>',
    }),
  }
}

export const H1Story: Story = {
  name: 'H1',
  ...typographyStory('h1'),
}

export const H2Story: Story = {
  name: 'H2',
  ...typographyStory('h2'),
}

export const H3Story: Story = {
  name: 'H3',
  ...typographyStory('h3'),
}

export const H4Story: Story = {
  name: 'H4',
  ...typographyStory('h4'),
}

export const PStory: Story = {
  name: 'P',
  ...typographyStory('p'),
}

export const BlockQuoteStory: Story = {
  name: 'BlockQuote',
  ...typographyStory('blockquote'),
}

export const TableStory: Story = {
  name: 'Table',
  render: () => ({
    template: `
      <div class="pr-typography-table-wrap">
        <table class="pr-typography-table">
          <thead>
            <tr>
              <th>Dispositif</th>
              <th>Accompagnement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Accueil de jour</td>
              <td>Coordination avec l'equipe educative</td>
            </tr>
            <tr>
              <td>Suivi familial</td>
              <td>Rendez-vous planifie avec les proches</td>
            </tr>
            <tr>
              <td>Projet personnalise</td>
              <td>Objectifs mis a jour apres evaluation</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  }),
}

export const ListULStory: Story = {
  name: 'List UL',
  render: () => ({
    components: { PrTypography },
    template: `
      <PrTypography variant="ul">
        <li>Accueil et orientation des personnes accompagnees</li>
        <li>Coordination entre les equipes et les partenaires</li>
        <li>Suivi des actions dans le projet personnalise</li>
      </PrTypography>
    `,
  }),
}

export const ListOLStory: Story = {
  name: 'List OL',
  render: () => ({
    components: { PrTypography },
    template: `
      <PrTypography variant="ol">
        <li>Recueillir les besoins de la personne</li>
        <li>Construire le plan d'accompagnement</li>
        <li>Evaluer les objectifs avec l'equipe</li>
      </PrTypography>
    `,
  }),
}

export const InlineCodeStory: Story = {
  name: 'InlineCode',
  ...typographyStory('inline-code'),
}

export const CodeBlockStory: Story = {
  name: 'CodeBlock',
  render: () => ({
    components: { PrTypography },
    template: `
      <PrTypography variant="code-block">
const dossier = await prisme.dossiers.creer({
  personne: 'Marie Dupont',
  referent: 'Equipe accompagnement',
})
      </PrTypography>
    `,
  }),
}

export const LeadStory: Story = {
  name: 'Lead',
  ...typographyStory('lead'),
}

export const LargeStory: Story = {
  name: 'Large',
  ...typographyStory('large'),
}

export const SmallStory: Story = {
  name: 'Small',
  ...typographyStory('small'),
}

export const SubtleStory: Story = {
  name: 'Subtle',
  ...typographyStory('subtle'),
}
