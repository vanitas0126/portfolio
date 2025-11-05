   ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## 배포 (Deployment)

  ### Vercel을 통한 배포 (추천)

  1. **GitHub에 코드 푸시**
     - GitHub에 새 레포지토리를 생성합니다
     - 프로젝트를 Git으로 초기화하고 푸시합니다:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin <your-github-repo-url>
     git push -u origin main
     ```

  2. **Vercel에 배포**
     - [Vercel](https://vercel.com)에 접속하여 계정을 생성하거나 로그인합니다
     - "Add New Project"를 클릭합니다
     - GitHub 레포지토리를 선택합니다
     - 프로젝트 설정:
       - Framework Preset: Vite
       - Build Command: `npm run build`
       - Output Directory: `docs`
     - "Deploy"를 클릭합니다
     - 배포가 완료되면 자동으로 URL이 생성됩니다

  3. **Vercel CLI를 통한 배포 (선택사항)**
     ```bash
     npm i -g vercel
     vercel
     ```

  ### 빌드 설정
  - 빌드 출력 디렉토리: `docs`
  - Vercel 설정 파일(`vercel.json`)이 이미 포함되어 있습니다

  ### 필요한 도구 설치
  - **Node.js**: [nodejs.org](https://nodejs.org/)에서 다운로드 (LTS 버전 권장)
  - **Git**: [git-scm.com](https://git-scm.com/)에서 다운로드

  ### 빠른 배포 방법 (Git 없이)
  1. **Netlify Drop 사용** (가장 간단)
     - [app.netlify.com/drop](https://app.netlify.com/drop)에 접속
     - `docs` 폴더를 드래그 앤 드롭 (먼저 `npm run build` 필요)
     - 또는 ZIP 파일로 업로드

  2. **Vercel CLI 사용**
     - Node.js 설치 후: `npm i -g vercel`
     - 프로젝트 폴더에서: `vercel`
     - 자동으로 배포 진행
  
