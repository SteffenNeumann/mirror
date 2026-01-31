# AI Prompting Rules 
---
agent: agent
---
**LMM Response Rule**

**L** - **Limit** length
- Maximum necessary words only
- Stop at complete answer

**M** - **Match** context precisely  
- Use only provided information
- Answer exactly what's asked
- Ignore unrelated details
- add Code  commands in codeblocks

**M** - **Minimize** elaboration
- Essential facts only
- No redundancy
- Direct statements

# AI Prompting Rules for {{project_type}} Development ({{project_name}} Project)

These rules ensure code integrity, maintain app functionality, and preserve consistency with the {{project_name}} project's architectural standards. All agents and contributors must adhere to these guidelines when developing or reviewing code.

## 1. Code Preservation and Modification Rules

- **Never modify existing functional code patterns without explicit permission.**
- **Always preserve established architecture patterns.**  
  - Specifically, maintain {{architecture_pattern}} separation as in the {{project_name}} structure.
- **Maintain consistency with established naming conventions, file and folder organization.**
- **Respect existing {{view_pattern}} structures.**  
  - Any proposed changes to these should be localized and justified.

## 2. Contextual Awareness Requirements

- **Review and reference the project's architecture documentation (`{{documentation_file}}`) before suggesting changes.**
- **Ensure all suggestions are compatible with {{framework}} patterns and {{platform}} development conventions.**
- **Account for the {{feature_1}} support integrated in the app.**  
  - Validate that all prompts and modifications preserve or enhance current {{feature_1}} structures.
- **Maintain alignment with the current {{feature_2}} systems.**

## 3. Self-Verification Protocol

- **Cross-reference all suggestions with the provided project structure and documentation.**
- **Explicitly verify compatibility with {{database_layer}} and other data persistence layers.**
- **Confirm that {{feature_3}} features remain functional or are improved.**
- **Validate that UI/UX patterns, as outlined in design docs and existing implementation, are preserved.**

## 4. Documentation and Communication Standards

- **Clearly document the reasoning behind any code modification or prompt suggestion.**
- **Reference exact files, classes, and components impacted by the changes.**
- **Provide example code snippets that strictly follow existing style patterns.**
- **Document any potential impact—positive or negative—on interconnected components or features.**


1. Project Overview Generation Prompt:
```
Create a comprehensive project-overview.md file with the following structure:
- Project Name and Description
- Core Functionalities
  - Function Name
  - Purpose
  - Input/Output
  - Dependencies
- Technology Stack
- Architecture Overview
- Current Known Limitations
- Roadmap and Future Improvements

Ensure the document is:
- Markdown formatted
- Easily readable
- Technically precise
- Updatable
```

2. Update Trigger Prompt:
```
Detect and document significant project changes:
- New features added
- Major architectural modifications
- Dependency updates
- Performance improvements

For each change, update project-overview.md with:
- Detailed description
- Reason for change
- Impact on existing functionality
- Updated dependencies/requirements
```

3. Maintenance Prompt:
```
Periodically review project-overview.md and:
- Verify information accuracy
- Remove outdated information
- Highlight potential improvements
- Check for consistency with actual codebase
```

Recommended Implementation Steps:
1. Create initial project-overview.md
2. Set up git hooks or CI/CD triggers
3. Integrate with project documentation workflow
4. Establish review process for updates

Edge Cases to Consider:
- Handling large, complex projects
- Maintaining overview for microservices
- Keeping documentation synchronized
- Managing multilingual documentation

Best Practices:
- Use version control for overview
- Make it a living document
- Encourage team collaboration
- Keep it concise and clear


## 5. Safety and Testing Guidelines

- **Require explicit confirmation from maintainers before suggesting or implementing any structural or architectural changes.**
- **Ensure strict backwards compatibility with existing feature sets and user flows.**
- **Assess and document the impact on current user preferences and settings.**
- **Thoroughly test and confirm that {{feature_1}} is not disrupted by proposed changes.**
- **Adhere to existing {{version_control}} workflow policies (always work on '{{main_branch}}'; pull before starting, commit/push after finishing).**
- **Run all existing unit and integration tests to ensure no regressions are introduced.**