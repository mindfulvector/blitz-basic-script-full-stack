import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import * as ace from 'ace-builds';
import { Subscription } from 'rxjs';
import * as IdeActions from '../store/ide.actions';
import * as IdeSelectors from '../store/ide.selectors';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';

@Component({
  selector: 'blitz-basic-script-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, AfterViewInit {
  @ViewChild('editor') private editor: ElementRef<HTMLElement>;

  subscriptions: Subscription[];
  aceEditor!: ace.Ace.Editor;

  constructor(private store: Store<any>, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.subscriptions = [];

    this.subscriptions.push(
      this.store
        .select(IdeSelectors.showEditorSettingsDialog)
        .subscribe((showEditorSettingsDialog: boolean) => {
          if (showEditorSettingsDialog) {
            const dialogRef: MatDialogRef<SettingsDialogComponent> = this.dialog.open(
              SettingsDialogComponent,
              {
                height: '400px',
                width: '600px',
              }
            );
            this.subscriptions.push(
              dialogRef.afterClosed().subscribe(() => {
                this.store.dispatch(IdeActions.closeEditorSettingsDialog());
              })
            );
          }
        })
    );
  }

  ngAfterViewInit(): void {
    this.setupAceEditor();
  }

  setupAceEditor(): void {
    // setup ACE editor
    ace.config.set('fontSize', '14px');
    ace.config.set(
      'basePath',
      'https://unpkg.com/ace-builds@1.4.12/src-noconflict'
    );

    this.aceEditor = ace.edit(this.editor.nativeElement);
    this.aceEditor.session.setOptions({ tabSize: 2 });
    this.aceEditor.session.setValue('Graphics 640, 480, 32, 2');

    // this.aceEditor.setTheme('ace/theme/ambiance');
    this.aceEditor.session.setMode('ace/mode/vbscript');
    // console.log('[ACE MODE]', this.aceEditor.session.getMode());

    this.aceEditor.commands.addCommand({
      name: 'formatCode',
      bindKey: { win: 'Ctrl-Alt-L', mac: 'Command-Alt-L' },
      exec: (editor: ace.Ace.Editor) => {
        console.log('[REFORMAT CODE]', editor);
      },
      readOnly: true, // false if this command should not apply in readOnly mode
    });

    this.aceEditor.commands.addCommand({
      name: 'codeAssistant',
      bindKey: { win: 'Ctrl-Alt-C', mac: 'Command-Alt-C' },
      exec: () => {
        console.log('[CODE ASSISTANT]');
      },
    });
  }

  openEditorSettings(): void {
    this.store.dispatch(IdeActions.openEditorSettingsDialog());
  }

  saveScript(): void {
    this.store.dispatch(IdeActions.saveScript({ script: [''] }));
  }

  undo(): void {
    this.aceEditor.undo();
  }

  redo(): void {
    this.aceEditor.redo();
  }

  activateCodeAssistant(): void {
    this.store.dispatch(IdeActions.activateCodeAssistant());
  }

  formatCode(): void {
    this.store.dispatch(
      IdeActions.formatCode({ code: this.aceEditor.getValue().split('\n') })
    );
  }
}
