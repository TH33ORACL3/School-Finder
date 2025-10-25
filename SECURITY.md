# 🔐 Security Policy

## 🚨 Important: API Key Exposure

**If you're seeing this file, an API key was previously exposed in this repository.**

### ⚠️ Immediate Action Required

The Gemini API key `AIzaSyBHnYroe7vAlSYgm9bWOeTkySLDSpe69e0` was committed to version control on GitHub.

**You MUST rotate this key immediately:**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Delete the compromised key: `AIzaSyBHnYroe7vAlSYgm9bWOeTkySLDSpe69e0`
3. Generate a new API key
4. Update your local `.env` file with the new key
5. **Never commit the `.env` file again** (it's now properly ignored)

### 🛡️ Security Fixes Applied

This repository has been secured with the following changes:

1. ✅ Added `.env*` to `.gitignore` to prevent future exposure
2. ✅ Removed `.env` from git tracking
3. ✅ Created `.env.example` as a safe template
4. ✅ Updated README with security best practices
5. ⚠️ **Still needed**: Remove `.env` from git history (see below)

### 🔄 Removing Sensitive Data from Git History

The `.env` file has been removed from tracking, but it still exists in git history. To completely remove it:

```bash
# Option 1: Using git filter-repo (recommended)
pip install git-filter-repo
git filter-repo --invert-paths --path .env --force

# Option 2: Using BFG Repo Cleaner
# Download from: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files .env
git reflog expire --expire=now --all && git gc --prune=now --aggressive

# After cleaning, force push (⚠️ CAUTION: This rewrites history)
git push origin --force --all
```

**⚠️ Warning**: Rewriting git history will affect all collaborators. Coordinate with your team before doing this.

### 🔒 Best Practices Going Forward

1. **Never commit sensitive data**
   - API keys, passwords, tokens, secrets
   - `.env` files are automatically ignored

2. **Use environment variables**
   - Store secrets in `.env` (git-ignored)
   - Use `.env.example` as a template (safe to commit)

3. **Rotate exposed keys immediately**
   - If any secret is exposed, assume it's compromised
   - Generate new keys before pushing fixes

4. **Use secret scanning**
   - Enable GitHub secret scanning in repository settings
   - Consider using pre-commit hooks like `gitleaks`

5. **Review before committing**
   - Always check `git diff` before committing
   - Use `git status` to see what files are staged

### 📚 Additional Resources

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Git Filter Repo](https://github.com/newren/git-filter-repo)
- [BFG Repo Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [Google AI API Key Management](https://makersuite.google.com/app/apikey)

### 🆘 Questions?

If you have questions about security practices or need help rotating keys, please reach out to the repository maintainer.

---

**Last Updated**: October 25, 2025

