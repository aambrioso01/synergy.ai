'use client'
import styles from './page.module.css'
import { TodoList } from './components/TodoList/TodoList'
import { AudioRecorder } from './components/AudioRecorder/AudioRecorder'
import { VoiceList } from './components/VoicesList'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <TodoList />
        <AudioRecorder />
        {/* <VoiceList /> */}
      </div>
    </main>
  )
}
