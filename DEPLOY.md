# 배포 가이드

## 현재 상황
- ✅ Vercel 설정 파일 (`vercel.json`) 준비됨
- ✅ 빌드 스크립트 준비됨
- ⚠️ Node.js 설치 필요
- ⚠️ Git 설치 필요 (GitHub 연동 시)

## 빠른 배포 방법

### 방법 1: Vercel 웹사이트 (GitHub 연동) - 추천

1. **Node.js 설치**
   - https://nodejs.org/ 에서 LTS 버전 다운로드 및 설치
   - 설치 후 PowerShell 재시작

2. **Git 설치**
   - https://git-scm.com/ 에서 다운로드 및 설치

3. **프로젝트 빌드**
   ```powershell
   cd porfolio-main
   npm install
   npm run build
   ```

4. **GitHub에 푸시**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   # GitHub에서 새 레포지토리 생성 후:
   git remote add origin https://github.com/사용자명/레포지토리명.git
   git push -u origin main
   ```

5. **Vercel 배포**
   - https://vercel.com 접속
   - "Add New Project" 클릭
   - GitHub 레포지토리 선택
   - 자동 감지된 설정 확인:
     - Framework: Vite
     - Build Command: `npm run build`
     - Output Directory: `docs`
   - "Deploy" 클릭

### 방법 2: Vercel CLI (직접 배포)

1. **Node.js 설치** (위와 동일)

2. **Vercel CLI 설치 및 배포**
   ```powershell
   npm install -g vercel
   cd porfolio-main
   vercel
   ```
   - 프롬프트에 따라 설정 진행
   - 배포 완료 후 URL 제공

### 방법 3: Netlify Drop (빌드 파일 필요)

1. **로컬에서 빌드** (Node.js 필요)
   ```powershell
   npm install
   npm run build
   ```

2. **Netlify Drop에 업로드**
   - https://app.netlify.com/drop 접속
   - `docs` 폴더를 드래그 앤 드롭
   - 또는 `docs` 폴더를 ZIP으로 압축 후 업로드

## 배포 후 확인사항

- ✅ UnicornStudio 임베드가 정상 작동하는지 확인
- ✅ 모든 비디오 파일이 정상 로드되는지 확인
- ✅ 반응형 디자인이 모바일에서도 작동하는지 확인

## 문제 해결

- **빌드 오류**: `npm install`을 다시 실행
- **UnicornStudio 로드 안됨**: 네트워크 연결 확인, CDN 접근 가능 여부 확인
- **경로 오류**: `vite.config.ts`의 `base` 설정 확인

