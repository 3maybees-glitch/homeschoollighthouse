#!/usr/bin/env python3
"""
Journey Homeschool Academy course catalog for Homeschool Lighthouse.

Primary catalog source: https://journeyhomeschoolacademy.com/tos/
(All Courses page). Live site is Cloudflare-protected; course metadata was
verified from Wayback Machine snapshots of catalog and individual course pages.
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from scrape_utils import write_scrape_output

SITE_NAME = "Journey Homeschool Academy"
BASE_URL = "https://journeyhomeschoolacademy.com"

# (title, path, grades_or_ages, prices_mentioned, description)
COURSES: list[tuple[str, str, str, str, str]] = [
    (
        "Journey Homeschool Academy",
        "/tos/",
        "Grades 1-12",
        "$97-$329",
        "Christian video-based homeschool science academy with expert-led online "
        "lessons and hands-on labs for elementary through high school. Family "
        "pricing covers the immediate household.",
    ),
    (
        "Experience Astronomy Elementary",
        "/experience-astronomy-elementary/",
        "Grades 1-5",
        "$149",
        "Basic astronomy curriculum with video lessons for elementary students "
        "ages 6-11. Complete family program with hands-on activities designed to "
        "spark excitement about science.",
    ),
    (
        "Experience Biology Elementary",
        "/experience-biology-elementary/",
        "Grades 1-5",
        "$149",
        "Hands-on elementary biology course for grades 1-5 with engaging videos "
        "and activities that keep young students excited about life science.",
    ),
    (
        "Earth Science Explored Elementary",
        "/earth-science-explored-elementary-students-age-6-11/",
        "Grades 1-5",
        "$149",
        "Elementary earth science curriculum for ages 6-11 with video lessons "
        "and nature-friendly activities for the whole family.",
    ),
    (
        "Physical Science Explored Elementary",
        "/physical-science-explored-elementary/",
        "Grades 1-5",
        "$149",
        "Elementary physical science explored course with video instruction and "
        "hands-on experiments for younger learners.",
    ),
    (
        "Experience Astronomy (Middle & High School)",
        "/experience-astronomy/",
        "Grades 7-12",
        "$179-$279",
        "Homeschool astronomy curriculum for middle and high school with "
        "engaging video lessons and hands-on instruction. Level B (students 12+) "
        "and Level C high school tracks available.",
    ),
    (
        "Earth Science Explored",
        "/earth-science-explored/",
        "Grades 6-8",
        "$179",
        "Middle school earth science and geology curriculum featuring engaging "
        "videos, labs, and hands-on activities for Level B students.",
    ),
    (
        "Physical Science Explored",
        "/physical-science-explored/",
        "Grades 6-12",
        "$179-$279",
        "Physical science video course for middle school (Level B) and high "
        "school (Level C) with labs and activities that prepare students for "
        "advanced science.",
    ),
    (
        "World of Birds (Backyard Birds)",
        "/world-of-birds/",
        "Grades 6-8",
        "$97",
        "Joyful 16-week middle school elective on backyard birds with hands-on "
        "science activities and minimal parent teaching load.",
    ),
    (
        "Marine Biology",
        "/marine-biology/",
        "Grades 6-8",
        "$97",
        "Faith-based marine biology curriculum for middle school (grades 6-8) "
        "with real academic skills and low teaching stress for parents.",
    ),
    (
        "Experience Biology",
        "/experience-biology/",
        "Grades 9-12",
        "$279",
        "High school biology with online video lessons, homeschool labs, quizzes, "
        "and activities that engage students in life science from a Christian "
        "worldview.",
    ),
    (
        "Experience Chemistry",
        "/experience-chemistry/",
        "Grades 9-12",
        "$279-$329",
        "High school chemistry curriculum with engaging labs, video lessons, "
        "quizzes, and hands-on activities that highlight God's order in every "
        "reaction.",
    ),
    (
        "Discover Physics",
        "/discover-physics/",
        "Grades 9-12",
        "$279",
        "Interactive high school physics video course covering fundamental "
        "principles and concepts without requiring parental subject expertise.",
    ),
    (
        "Discover Anatomy & Physiology",
        "/discover-anatomy-physiology/",
        "Grades 9-12",
        "$279",
        "High school anatomy and physiology online video course with hands-on "
        "labs and activities exploring God's design of the human body.",
    ),
    (
        "Equipped Bible Course",
        "/equipped-bible-course-study/",
        "Grades 9-12",
        "$179",
        "Online homeschool Bible study curriculum for teens and high school "
        "students, designed to equip them to understand and read Scripture.",
    ),
]


def main() -> None:
    rows = [
        {
            "title": title,
            "website_url": f"{BASE_URL}{path}",
            "source": SITE_NAME,
            "grades_or_ages": grades,
            "prices_mentioned": price,
            "description": description,
        }
        for title, path, grades, price, description in COURSES
    ]
    write_scrape_output(rows, "journey-homeschool-academy")


if __name__ == "__main__":
    main()
