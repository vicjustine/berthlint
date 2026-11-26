import * as vscode from 'vscode'; 
import { Assignment, findProblems } from './berths';

let collection: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext){
    collection = vscode.languages.createDiagnosticCollection('berthlint');
    context.subscriptions.push(collection);
    context.subscriptions.push(
        vscode.commands.registerCommand('berthlint.checkManifest', checkManifest)
    );

}

function checkManifest(): void {
    const editor = vscode.window.activeTextEditor;
    if(!editor) {
        vscode.window.showWarningMessage('Berth Lint: open a manifest first.');
        return;
    }

    const limit = vscode.workspace
        .getConfiguration('berthlint')
        .get<number>('maxTeuPerBerth', 4000); 
    
    let rows: Assignment[];
    try {
        rows = JSON.parse(editor.document.getText());   
    } catch {
        vscode.window.showErrorMessage('Berth Lint: this file is not valid JSON.');
        return;
    }

    const problems = findProblems(rows, limit);
    const text = editor.document.getText();

    collection.set(editor.document.uri, problems.map((problems) => {
        const at = text.indexOf(`"${problems.berth}"`);
        const pos = at < 0 ? new vscode.Position(0, 0) : editor.document.positionAt(at);
        return new vscode.Diagnostic(
            new vscode.Range(pos, pos.translate(0, problems.berth.length + 2)),
            problems.message, 
            vscode.DiagnosticSeverity.Warning
        );
      }));

      vscode.window.showInformationMessage(
        `Berth Lint: ${problems.length} problems(s) in ${editor.document.fileName.split('/').pop()}`
      );
    }

export function deactivate(){
    collection?.dispose();
}
      