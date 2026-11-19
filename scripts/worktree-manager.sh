#!/usr/bin/env bash
# Worktree Manager for prompt-optimizer UI Rewrite

set -e

REPO_ROOT="/root/workspace/prompt-optimizer/Promlt opti"
WORKTREE_BASE="$REPO_ROOT/../worktrees/ui-rewrite"

usage() {
    echo "Usage: $0 <command> [args]"
    echo "Commands:"
    echo "  create <task-id> <slug>     Create worktree for task"
    echo "  list                        List active worktrees"
    echo "  clean <task-id>             Remove worktree and branch"
    echo "  merge <task-id>             Merge worktree branch to main and clean"
    echo "  status <task-id>            Show worktree status"
}

create_worktree() {
    local task_id="$1"
    local slug="$2"
    local branch_name="ui-rewrite/${task_id}-${slug}"
    local worktree_path="$WORKTREE_BASE/${task_id}-${slug}"
    
    cd "$REPO_ROOT"
    
    # Create worktree directory
    mkdir -p "$WORKTREE_BASE"
    
    # Create branch from main
    git branch "$branch_name" main 2>/dev/null || git checkout -b "$branch_name" main
    
    # Create worktree
    git worktree add "$worktree_path" "$branch_name"
    
    echo "Created worktree: $worktree_path"
    echo "Branch: $branch_name"
    echo "Switch to it: cd $worktree_path"
}

list_worktrees() {
    cd "$REPO_ROOT"
    git worktree list
}

clean_worktree() {
    local task_id="$1"
    local worktree_path="$WORKTREE_BASE/${task_id}-*"
    
    cd "$REPO_ROOT"
    
    # Find actual path
    local actual_path=$(ls -d $worktree_path 2>/dev/null | head -1)
    if [[ -z "$actual_path" ]]; then
        echo "Worktree not found for task: $task_id"
        exit 1
    fi
    
    local branch_name=$(basename "$actual_path")
    branch_name="ui-rewrite/$branch_name"
    
    # Remove worktree
    git worktree remove "$actual_path" --force
    
    # Delete branch
    git branch -D "$branch_name" 2>/dev/null || true
    
    echo "Cleaned worktree: $actual_path"
    echo "Deleted branch: $branch_name"
}

merge_worktree() {
    local task_id="$1"
    local worktree_path="$WORKTREE_BASE/${task_id}-*"
    
    cd "$REPO_ROOT"
    
    local actual_path=$(ls -d $worktree_path 2>/dev/null | head -1)
    if [[ -z "$actual_path" ]]; then
        echo "Worktree not found for task: $task_id"
        exit 1
    fi
    
    local branch_name=$(basename "$actual_path")
    branch_name="ui-rewrite/$branch_name"
    
    # Check for uncommitted changes
    cd "$actual_path"
    if [[ -n $(git status --porcelain) ]]; then
        echo "Uncommitted changes in worktree. Commit or stash first."
        exit 1
    fi
    
    # Merge to main
    cd "$REPO_ROOT"
    git checkout main
    git merge --no-ff "$branch_name" -m "Merge $branch_name: UI rewrite task $task_id"
    
    # Clean up
    git worktree remove "$actual_path" --force
    git branch -d "$branch_name"
    
    echo "Merged $branch_name to main"
    echo "Cleaned worktree: $actual_path"
}

status_worktree() {
    local task_id="$1"
    local worktree_path="$WORKTREE_BASE/${task_id}-*"
    
    local actual_path=$(ls -d $worktree_path 2>/dev/null | head -1)
    if [[ -z "$actual_path" ]]; then
        echo "Worktree not found for task: $task_id"
        exit 1
    fi
    
    cd "$actual_path"
    echo "Worktree: $actual_path"
    echo "Branch: $(git branch --show-current)"
    echo "Status:"
    git status --short
}

case "$1" in
    create)
        create_worktree "$2" "$3"
        ;;
    list)
        list_worktrees
        ;;
    clean)
        clean_worktree "$2"
        ;;
    merge)
        merge_worktree "$2"
        ;;
    status)
        status_worktree "$2"
        ;;
    *)
        usage
        exit 1
        ;;
esac
