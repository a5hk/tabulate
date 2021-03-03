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

    const minPadLen = 10;
    let maxLen = 0;
    for (let l = te.selection.start.line; l <= te.selection.end.line; l++) {
      if (te.document.lineAt(l).text.indexOf(":") > maxLen) {
        maxLen = te.document.lineAt(l).text.indexOf(":");
      }
    }

    for (let l = te.selection.start.line; l <= te.selection.end.line; l++) {
      if (te.document.lineAt(l).text.indexOf(":") + minPadLen > maxLen) {
        maxLen += minPadLen;
        break;
      }
    }

    let line = "";
    for (let l = te.selection.start.line; l <= te.selection.end.line; l++) {
      line = te.document.lineAt(l).text;

      if (line.indexOf(":") !== -1) {
        tee.insert(
          new vscode.Position(l, line.indexOf(":") + 1),
          ` /* ...${".".repeat(maxLen - line.indexOf(":") - minPadLen)} */`
        );
      }
    }
  });

  let unTabulateCommand = vscode.commands.registerTextEditorCommand("tabulate.untabulate", (te, tee) => {
    let re = /:\s*\/\*.*\*\/(?=.*\S)/;

    for (let l = te.selection.start.line; l <= te.selection.end.line; l++) {
      let result = re.exec(te.document.lineAt(l).text);

      if (result !== null) {
        tee.replace(
          new vscode.Range(
            new vscode.Position(l, result.index),
            new vscode.Position(l, result.index + result[0].length)
          ),
          ":"
        );
      }
    }
  });

  context.subscriptions.push(tabulateCommand, unTabulateCommand);
}

export function deactivate() {}
