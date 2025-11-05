# GitHub에 업로드하는 방법

## 1단계: Git 설치 (필요한 경우)

Git이 설치되어 있지 않다면 설치하세요:

```powershell
winget install Git.Git
```

설치 후 PowerShell을 재시작하세요.

## 2단계: Git 저장소 초기화

프로젝트 폴더에서 다음 명령어를 실행하세요:

```powershell
# Git 저장소 초기화
git init

# 사용자 정보 설정 (처음 한 번만)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 3단계: 파일 추가 및 첫 커밋

```powershell
# 모든 파일 추가
git add .

# 커밋 생성
git commit -m "Initial commit: Portfolio with UnicornStudio embeds"
```

## 4단계: GitHub에서 새 저장소 만들기

1. GitHub.com에 로그인
2. 오른쪽 상단의 `+` 버튼 클릭 → `New repository` 선택
3. Repository name 입력 (예: `portfolio`)
4. Public 또는 Private 선택
5. **"Initialize this repository with a README" 체크박스는 해제하세요**
6. `Create repository` 클릭

## 5단계: GitHub에 푸시

GitHub에서 저장소를 만든 후, 제공되는 명령어를 사용하거나:

```powershell
# 원격 저장소 추가 (YOUR_USERNAME과 YOUR_REPO_NAME을 실제 값으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# main 브랜치로 이름 변경 (GitHub 기본값)
git branch -M main

# 푸시
git push -u origin main
```

## 6단계: 인증

GitHub에서 Personal Access Token을 사용해야 할 수 있습니다:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. `Generate new token` 클릭
3. `repo` 권한 선택
4. 토큰 생성 후 복사
5. `git push` 시 비밀번호 대신 토큰 사용

## 대안: GitHub Desktop 사용

코드 대신 GUI를 사용하고 싶다면:

1. [GitHub Desktop 다운로드](https://desktop.github.com/)
2. 설치 후 로그인
3. `File` → `Add Local Repository` → 프로젝트 폴더 선택
4. `Publish repository` 클릭

