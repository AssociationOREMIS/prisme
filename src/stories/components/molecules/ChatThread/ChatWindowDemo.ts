import { MessageCircleHeart } from '@lucide/vue'
import { defineComponent, nextTick, ref } from 'vue'
import { PrStatusDot } from '../../../../components/atoms/StatusDot'
import { PrChatComposer } from '../../../../components/molecules/ChatComposer'
import { PrChatMessage } from '../../../../components/molecules/ChatMessage'
import { PrChatThread } from '../../../../components/molecules/ChatThread'
import { PrTypingIndicator } from '../../../../components/molecules/TypingIndicator'

interface DemoMessage {
  id: number
  author: 'self' | 'other' | 'system'
  text: string
  sender?: string
  time?: string
  status?: string
}

/**
 * A chat window between an anonymous visitor and the volunteers, built from the chat bricks: the
 * header is the app's own (avatar, name, status), Prisme gives the thread, messages and composer.
 * Shared by the Chat/Conversation and Actions/Fab stories.
 */
export const ChatWindowDemo = defineComponent({
  name: 'ChatWindowDemo',
  components: { MessageCircleHeart, PrChatComposer, PrChatMessage, PrChatThread, PrStatusDot, PrTypingIndicator },
  props: {
    multiline: { type: Boolean, default: false },
    headingId: { type: String, default: 'chat-demo-title' },
  },
  setup(_props, { expose }) {
    const draft = ref('')
    const typing = ref(true)
    let nextId = 4
    const items = ref<DemoMessage[]>([
      { id: 1, author: 'system', text: 'Vous êtes en contact avec OREMIS. Cette conversation est anonyme.' },
      { id: 2, author: 'other', sender: 'OREMIS', time: '14:30', text: 'Bonjour, je suis Alex, bénévole. Je vous écoute, prenez votre temps.' },
      { id: 3, author: 'self', time: '14:31', status: 'Lu', text: 'Bonjour, des élèves se moquent de moi tous les jours.' },
    ])

    function send(text: string) {
      typing.value = false
      items.value.push({ id: nextId++, author: 'self', text, time: '14:32', status: 'Envoyé' })
    }

    const composer = ref<{ $el: HTMLElement } | null>(null)
    function focusComposer() {
      void nextTick(() => composer.value?.$el.querySelector<HTMLElement>('input, textarea')?.focus())
    }
    expose({ focusComposer })

    return { draft, items, typing, send, composer }
  },
  template: `
    <section
      class="chat-demo"
      :aria-labelledby="headingId"
      style="display: flex; flex-direction: column; width: min(24rem, 100%); height: min(32rem, calc(100vh - 7rem)); min-height: 20rem; overflow: hidden; border: 1px solid var(--pr-color-border); border-radius: var(--pr-radius-xl); background: var(--pr-color-surface); box-shadow: var(--pr-shadow-md);"
    >
      <header style="display: flex; align-items: center; gap: var(--pr-space-3); padding: var(--pr-space-3) var(--pr-space-4); border-bottom: 1px solid var(--pr-color-border);">
        <span aria-hidden="true" style="display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; flex-shrink: 0; border-radius: var(--pr-radius-full); background: var(--pr-color-primary-soft); color: var(--pr-color-primary);">
          <MessageCircleHeart :size="22" />
        </span>
        <div style="display: grid; gap: 0.125rem;">
          <h2 :id="headingId" style="margin: 0; font-family: var(--pr-font-heading); font-size: var(--pr-font-size-lg); line-height: var(--pr-line-height-tight); color: var(--pr-color-heading);">OREMIS</h2>
          <PrStatusDot variant="success" label="Un bénévole vous répond" pulse />
        </div>
      </header>
      <PrChatThread :count="items.length + (typing ? 1 : 0)">
        <PrChatMessage
          v-for="item in items"
          :key="item.id"
          :author="item.author"
          :sender="item.sender"
          :time="item.time"
          :status="item.status"
        >{{ item.text }}</PrChatMessage>
        <PrTypingIndicator v-if="typing" />
      </PrChatThread>
      <PrChatComposer ref="composer" v-model="draft" :multiline="multiline" :maxlength="1000" @send="send" />
    </section>
  `,
})
