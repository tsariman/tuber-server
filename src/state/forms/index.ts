import Config from 'src/config'
import IStateAllForms from '../../../../tuber-client/src/controllers/interfaces/IStateAllForms'
import devInstallForm from 'src/INSTALL.DEV/dev.install/dev.install.form.state'
import jsonFormNewNote from './new.note.form.state'
import loginForm from './login.form.state'

// TODO Insert forms in this object
const forms: IStateAllForms = {}

forms['loginForm'] = loginForm
forms['newNoteForm'] = jsonFormNewNote

if (Config.DEV) {
  forms['devInstallForm'] = devInstallForm
}

export default forms
