import { Route, Routes } from 'react-router-dom'
import { HomePage } from '../home/HomePage'
import { LessonPage } from '../lesson/LessonPage'
import { NotesPage } from '../notes/NotesPage'
import { NotFound } from './NotFound'

/** Routes live under the URL hash (#/lesson/lesson-01), see main.tsx. */
export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lesson/:lessonId" element={<LessonPage />} />
      <Route path="/lesson/:lessonId/notes" element={<NotesPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
