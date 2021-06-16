import * as vscode from "vscode";

const minPadLen = 10;

function checkLinesSelected(te: vscode.TextEditor): boolean {
  if (te.selections.length > 1) {
    vscode.window.showInformationMessage("Only one selection is supported.");
    return false;
  }
  if (te.selection.isSingleLine) {
    vscode.window.showInformationMessage("Please select at least two lines.");
    return false;
  }
  return true;
}

function leftOrRight(str: string, right: boolean): number {
  return right ? str.trim().length : str.indexOf(":");
}

function calculateMaxLength(te: vscode.TextEditor, right = false): number {
  let maxLen = 0;

  for (let l = te.selection.start.line; l <= te.selection.end.line; l++) {
    if (leftOrRight(te.document.lineAt(l).text, right) > maxLen) {
      maxLen = leftOrRight(te.document.lineAt(l).text, right);
    }
  }

  for (let l = te.selection.start.line; l <= te.selection.end.line; l++) {
    if (leftOrRight(te.document.lineAt(l).text, right) + minPadLen > maxLen) {
      maxLen += minPadLen;
      return maxLen;
    }
  }
  return maxLen;
}

function pad(te: vscode.TextEditor, tee: vscode.TextEditorEdit, right = false) {
  let maxLen = calculateMaxLength(te, right);
  let line = "";

  for (let l = te.selection.start.line; l <= te.selection.end.line; l++) {
    line = te.document.lineAt(l).text;

    if (line.indexOf(":") !== -1) {
      tee.insert(
        new vscode.Position(l, line.indexOf(":") + 1),
        ` /* ...${".".repeat(maxLen - leftOrRight(line, right) - minPadLen)} */`
      );
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  let tabulateCommand = vscode.commands.registerTextEditorCommand("tabulate.tabulate", (te, tee) => {
    if (!checkLinesSelected(te)) {
      return;
    }

    pad(te, tee);
  });

  let tabulateRightCommand = vscode.commands.registerTextEditorCommand("tabulate.tabulate_right", (te, tee) => {
    if (!checkLinesSelected(te)) {
      return;
    }

    pad(te, tee, true);
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

  let retabulateCommand = vscode.commands.registerTextEditorCommand("tabulate.retabulate", (te, tee) => {
    vscode.commands.executeCommand("tabulate.untabulate").then(() => {
      vscode.commands.executeCommand("tabulate.tabulate");
    });
  });

  let retabulateRightCommand = vscode.commands.registerTextEditorCommand("tabulate.retabulate_right", (te, tee) => {
    vscode.commands.executeCommand("tabulate.untabulate").then(() => {
      vscode.commands.executeCommand("tabulate.tabulate_right");
    });
  });

  context.subscriptions.push(
    tabulateCommand,
    tabulateRightCommand,
    unTabulateCommand,
    retabulateCommand,
    retabulateRightCommand
  );
}

export function deactivate() {}
