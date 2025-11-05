# 빠른 배포 가이드

## 현재 상황
- ✅ 프로젝트 코드 준비됨
- ✅ Vercel 설정 파일 준비됨
- ✅ GitHub Actions 워크플로우 준비됨
- ⚠️ Node.js 설치 필요 (로컬 빌드용)

## 가장 빠른 배포 방법

### 방법 1: Netlify Drop (5분 소요) ⭐ 추천

1. **Node.js 설치** (아직 안 했다면)
   - https://nodejs.org/ 다운로드 (LTS 버전)
   - 설치 후 PowerShell 재시작

2. **프로젝트 빌드**
   ```powershell
   cd porfolio-main
   npm install
   npm run build
   ```

3. **Netlify Drop에 배포**
   - https://app.netlify.com/drop 접속
   - `docs` 폴더를 드래그 앤 드롭
   - 즉시 배포 완료! URL 받기

### 방법 2: GitHub + Vercel (자동 배포)

1. **GitHub에 코드 업로드**
   - GitHub.com에서 새 레포지토리 생성
   - GitHub Desktop 또는 웹 인터페이스로 파일 업로드

2. **Vercel 연동**
   - https://vercel.com 접속
   - "Add New Project"
   - GitHub 레포지토리 선택
   - 자동 빌드 및 배포

### 방법 3: Vercel CLI (터미널에서)

1. **Node.js 설치** (위와 동일)

2. **Vercel CLI 설치 및 배포**
   ```powershell
   npm install -g vercel
   cd porfolio-main
   vercel
   ```
   - 프롬프트에 따라 진행
   - 배포 완료!

## 지금 바로 배포하려면?

**가장 간단한 방법:**
1. Node.js 설치: https://nodejs.org/
2. PowerShell 재시작
3. 아래 명령어 실행:
   ```powershell
   cd porfolio-main
   npm install
   npm run build
   ```
4. https://app.netlify.com/drop 에서 `docs` 폴더 드래그 앤 드롭

**또는 GitHub 사용:**
- GitHub Desktop 설치: https://desktop.github.com/
- 레포지토리 생성 및 업로드
- Vercel에서 자동 배포

