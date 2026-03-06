#!/usr/bin/env python3
"""Fix indentation of toggleComments button and commentPanel to match sibling level."""

with open('index.html', 'r') as f:
    lines = f.readlines()

# Find the closing </div> of editorToolbox (line that has </div> after toolboxTrigger </button>)
# Then fix all subsequent lines until the next sibling at the correct level

# The editorToolbox opens at 9 tabs depth
# Children of the same parent (div.relative.flex) should also be at 9 tabs
# But toggleComments is currently at 11 tabs

# Find the line after editorToolbox closes
editorToolbox_close = None
for i, line in enumerate(lines):
    s = line.strip()
    if s == '</div>' and i > 0:
        prev = lines[i-1].strip()
        if prev == '</button>' and i > 1:
            prev2 = lines[i-2].strip()
            if '</svg>' in prev2:
                # Check if this is after toolboxTrigger
                for j in range(max(0, i-10), i):
                    if 'id="toolboxTrigger"' in lines[j]:
                        editorToolbox_close = i
                        break
    if editorToolbox_close is not None:
        break

if editorToolbox_close is None:
    print("Could not find editorToolbox closing tag")
    exit(1)

print(f"editorToolbox closes at line {editorToolbox_close + 1}")

# Count tabs on editorToolbox close line
close_tabs = len(lines[editorToolbox_close]) - len(lines[editorToolbox_close].lstrip('\t'))
print(f"editorToolbox close indentation: {close_tabs} tabs")

# Now fix the toggleComments button and commentPanel
# They start right after, and should be at the same depth as editorToolbox (close_tabs tabs)
# Currently they're at 11 tabs (too deep by 2)

# Find where the comments section ends (the closing </div> of the editor-relative container)
i = editorToolbox_close + 1
fixes = 0
while i < len(lines):
    s = lines[i].strip()
    current_tabs = len(lines[i]) - len(lines[i].lstrip('\t'))
    
    # If we find a line at editorToolbox level or lower that's a </div>, stop
    if current_tabs <= close_tabs and s == '</div>' and i > editorToolbox_close + 1:
        break
    
    # Fix lines that are too deeply indented
    # They should be shifted left by 2 tabs
    if current_tabs > close_tabs and lines[i].strip():
        excess = current_tabs - close_tabs
        if excess >= 2:
            # Remove 2 extra tabs
            lines[i] = lines[i][2:]  # Remove 2 leading tabs
            fixes += 1
    
    i += 1

print(f"Fixed {fixes} lines")

with open('index.html', 'w') as f:
    f.writelines(lines)
