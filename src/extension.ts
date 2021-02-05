import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let tabulateCommand = vscode.commands.registerTextEditorCommand("tabulate.tabulate", (te, tee) => {
    if (te.selections.length > 1) {
      vscode.window.showInformationMessage("Only one selection is supported.");
      return;
    }
    if (te.selection.isSingleLine) {
      vscode.window.showInformationMessage("Please select at least two lines.");
      return;
    }

    const lines = te.document.getText(te.selection).split("\n");
    let maxLen = lines.reduce((accum, current) => {
      return current.trim().length > accum ? current.trim().length : accum;
    }, lines[0].trim().length);

    for (const line of lines) {
      if (line.trim().length < maxLen && line.trim().length + 4 > maxLen) {
        maxLen += 4;
        break;
      }
    }

    let i = 0;
    let line = "";
    let l = 2;

    for (l = 2; i < 3; l++) {
      // if (line.trim().length < maxLen) {
      // line = te.document.lineAt(l).text;
      console.log(l);
      // tee.insert(new vscode.Position(l, line.indexOf(":") + 1), `/*${".".repeat(maxLen - line.trim().length)}*/`);
      // }
    }

    // for (const line of lines) {
    // for (let l = te.selection.start.line; i < te.selection.end.line; l++) {
    // for (l = 2; i < 3; l++) {
    //   // if (line.trim().length < maxLen) {
    //   // line = te.document.lineAt(l).text;
    //   console.log(l);
    //   // tee.insert(new vscode.Position(l, line.indexOf(":") + 1), `/*${".".repeat(maxLen - line.trim().length)}*/`);
    //   // }
    // }

    // tee.insert(te.selection.start, "***");
  });

  context.subscriptions.push(tabulateCommand);
}

export function deactivate() {}
