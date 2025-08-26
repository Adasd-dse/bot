# Privacy Screen App (SafeView) - Makefile
# Common development tasks and shortcuts

.PHONY: help install install-dev test test-cov lint format clean build run demo

# Default target
help:
	@echo "Privacy Screen App (SafeView) - Development Commands"
	@echo ""
	@echo "Available commands:"
	@echo "  install      - Install production dependencies"
	@echo "  install-dev  - Install development dependencies"
	@echo "  test         - Run tests"
	@echo "  test-cov     - Run tests with coverage"
	@echo "  lint         - Run linting checks"
	@echo "  format       - Format code with black and isort"
	@echo "  clean        - Clean build artifacts and cache"
	@echo "  build        - Build package"
	@echo "  run          - Run the application"
	@echo "  demo         - Run demo mode"
	@echo "  docs         - Build documentation"
	@echo "  docker       - Build Docker image"
	@echo ""

# Install production dependencies
install:
	pip install -e .

# Install development dependencies
install-dev:
	pip install -e ".[dev]"

# Run tests
test:
	python -m pytest tests/ -v

# Run tests with coverage
test-cov:
	python -m pytest tests/ --cov=src --cov-report=html --cov-report=term

# Run linting checks
lint:
	flake8 src/ tests/
	mypy src/
	black --check src/ tests/
	isort --check-only src/ tests/

# Format code
format:
	black src/ tests/
	isort src/ tests/

# Clean build artifacts
clean:
	rm -rf build/
	rm -rf dist/
	rm -rf *.egg-info/
	rm -rf .pytest_cache/
	rm -rf .coverage
	rm -rf htmlcov/
	rm -rf .mypy_cache/
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

# Build package
build: clean
	python -m build

# Run the application
run:
	python src/main.py

# Run demo mode
demo:
	python src/main.py --demo

# Build documentation
docs:
	cd docs && make html

# Build Docker image
docker:
	docker build -t privacy-screen-app .

# Setup development environment
setup-dev: install-dev
	pre-commit install
	@echo "Development environment setup complete!"

# Check code quality
quality: lint format test
	@echo "Code quality checks completed!"

# Release preparation
release: quality build
	@echo "Release preparation completed!"

# Install pre-commit hooks
hooks:
	pre-commit install

# Update dependencies
update-deps:
	pip install --upgrade -r requirements.txt
	pip install --upgrade -r requirements-dev.txt

# Create virtual environment
venv:
	python -m venv venv
	@echo "Virtual environment created. Activate with:"
	@echo "  source venv/bin/activate  # Linux/macOS"
	@echo "  venv\\Scripts\\activate     # Windows"

# Security checks
security:
	bandit -r src/
	safety check

# Performance profiling
profile:
	python -m cProfile -o profile.stats src/main.py
	@echo "Profile data saved to profile.stats"
	@echo "View with: python -c 'import pstats; pstats.Stats(\"profile.stats\").sort_stats(\"cumulative\").print_stats(20)'"

# Memory profiling
memory:
	python -m memory_profiler src/main.py

# Platform-specific commands
ifeq ($(OS),Windows_NT)
	# Windows commands
	activate = venv\Scripts\activate
else
	# Unix-like commands
	activate = source venv/bin/activate
endif

# Run with virtual environment
run-venv:
	$(activate) && python src/main.py

# Test with virtual environment
test-venv:
	$(activate) && python -m pytest tests/ -v

# Install in virtual environment
install-venv:
	$(activate) && pip install -e ".[dev]"