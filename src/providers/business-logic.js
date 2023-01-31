function substringSearch(pattern, text) {
  if (pattern.length == 0) {
    return 0; // Immediate match
  }
  var lsp = [0];
  for (var i = 1; i < pattern.length; i++) {
    var j = lsp[i - 1];
    while (j > 0 && pattern.charAt(i) != pattern.charAt(j)) j = lsp[j - 1];
    if (pattern.charAt(i) == pattern.charAt(j)) j++;
    lsp.push(j);
  }

  var j = 0;
  for (var i = 0; i < text.length; i++) {
    while (j > 0 && text.charAt(i) != pattern.charAt(j)) j = lsp[j - 1];
    if (text.charAt(i) == pattern.charAt(j)) {
      j++;
      if (j == pattern.length) return i - (j - 1);
    }
  }
  return -1; // Not found
}

export { substringSearch };
