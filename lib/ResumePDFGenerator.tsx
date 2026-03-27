// @ts-nocheck
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// 注册中文字体 - 使用jsDelivr CDN (更可靠)
Font.register({
  family: 'SourceHanSansSC',
  src: 'https://cdn.jsdelivr.net/gh/adobe-fonts/source-han-sans@release/SubsetOTF/CN/SourceHanSansCN-Regular.otf',
  fontWeight: 400,
});

// 样式定义（极致紧凑单页格式）
const styles = StyleSheet.create({
  page: {
    padding: '10mm 15mm',
    fontSize: 8.5,
    fontFamily: 'SourceHanSansSC',
    lineHeight: 1.25,
    hyphenationCallback: (e: string) => [e],
  },

  // 顶部布局
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  headerLeft: {
    width: 40,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 60,
    height: 78,
  },
  logo: {
    width: 35,
    height: 35,
  },
  photo: {
    width: 60,
    height: 78,
    objectFit: 'cover',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: 1.5,
    hyphenationCallback: (e: string) => [e],
  },
  jobTitle: {
    fontSize: 10,
    marginBottom: 2,
    hyphenationCallback: (e: string) => [e],
  },
  contactInfo: {
    fontSize: 8,
    textAlign: 'center',
    hyphenationCallback: (e: string) => [e],
  },

  // 分隔线
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 3,
  },

  // Section标题
  sectionTitle: {
    fontSize: 9.5,
    fontWeight: 'bold',
    marginBottom: 2,
    marginTop: 1,
    hyphenationCallback: (e: string) => [e],
  },

  // 教育背景
  educationItem: {
    marginBottom: 3,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0.5,
  },
  schoolName: {
    fontSize: 9,
    fontWeight: 'bold',
    hyphenationCallback: (e: string) => [e],
  },
  educationInfo: {
    fontSize: 8,
    lineHeight: 1.25,
    marginBottom: 0.5,
    hyphenationCallback: (e: string) => [e],
  },

  // 实习经历
  experienceItem: {
    marginBottom: 3,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  companyName: {
    fontSize: 9,
    fontWeight: 'bold',
    hyphenationCallback: (e: string) => [e],
  },
  bulletText: {
    fontSize: 8,
    lineHeight: 1.25,
    marginBottom: 1.5,
    hyphenationCallback: (e: string) => [e],
  },

  // 项目经历
  projectItem: {
    marginBottom: 3,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },

  // 技能证书
  skillContent: {
    fontSize: 8,
    lineHeight: 1.25,
    marginBottom: 1.5,
    hyphenationCallback: (e: string) => [e],
  },

  bold: {
    fontWeight: 'bold',
    hyphenationCallback: (e: string) => [e],
  },
});

interface ResumeData {
  basic: {
    name: string;
    jobTitle: string;
    phone: string;
    email: string;
    age?: string;
    location: string;
    logoUrl?: string;
    photoUrl?: string;
  };
  education: Array<{
    school: string;
    degree: string;
    major: string;
    duration: string;
    gpa?: string;
    awards?: string;
    courses?: string;
  }>;
  experiences: Array<{
    position: string;
    company: string;
    duration: string;
    highlights: Array<{
      title: string;
      content: string;
    }>;
  }>;
  projects: Array<{
    role: string;
    name: string;
    duration: string;
    details: Array<{
      title: string;
      content: string;
    }>;
  }>;
  skills: Array<{
    category: string;
    content: string;
  }>;
}

export const ResumePDF: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { basic, education, experiences, projects, skills } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        {/* 顶部：Logo + 姓名 + 照片 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {basic.logoUrl && (
              <Image src={basic.logoUrl} style={styles.logo} />
            )}
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.name}>{basic.name}</Text>
            <Text style={styles.jobTitle}>{basic.jobTitle}</Text>
            <Text style={styles.contactInfo}>
              {basic.phone} | {basic.email} | 年龄：{basic.age} | 现居地：{basic.location}
            </Text>
          </View>

          <View style={styles.headerRight}>
            {basic.photoUrl && (
              <Image src={basic.photoUrl} style={styles.photo} />
            )}
          </View>
        </View>

        <View style={styles.divider} />

        {/* 教育背景 */}
        <Text style={styles.sectionTitle}>教育背景</Text>
        {education.map((edu, index) => (
          <View key={index} style={styles.educationItem}>
            <View style={styles.educationHeader}>
              <Text style={{ fontSize: 8, hyphenationCallback: (e: string) => [e] }}>
                {`${edu.school}  ${edu.major}  ${edu.degree}`}
              </Text>
              <Text style={{ fontSize: 8, hyphenationCallback: (e: string) => [e] }}>{edu.duration}</Text>
            </View>
            {edu.gpa && (
              <Text style={styles.educationInfo}>{edu.gpa}</Text>
            )}
            {edu.courses && (
              <Text style={styles.educationInfo}>主修课程：{edu.courses}</Text>
            )}
          </View>
        ))}

        <View style={styles.divider} />

        {/* 实习经历 */}
        <Text style={styles.sectionTitle}>实习经历</Text>
        {experiences.map((exp, index) => (
          <View key={index} style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              <Text style={{ fontSize: 8, hyphenationCallback: (e: string) => [e] }}>
                {`${exp.position}  ${exp.company}`}
              </Text>
              <Text style={{ fontSize: 8, hyphenationCallback: (e: string) => [e] }}>{exp.duration}</Text>
            </View>
            {exp.highlights.map((highlight, idx) => (
              <Text key={idx} style={styles.bulletText} orphans={0} widows={0}>
                {`• ${highlight.title}：${highlight.content}`}
              </Text>
            ))}
          </View>
        ))}

        <View style={styles.divider} />

        {/* 项目经历 */}
        <Text style={styles.sectionTitle}>项目经历</Text>
        {projects.map((proj, index) => (
          <View key={index} style={styles.projectItem}>
            <View style={styles.projectHeader}>
              <Text style={{ fontSize: 8, hyphenationCallback: (e: string) => [e] }}>
                {`${proj.role}  ${proj.name}`}
              </Text>
              <Text style={{ fontSize: 8, hyphenationCallback: (e: string) => [e] }}>{proj.duration}</Text>
            </View>
            {proj.details.map((detail, idx) => (
              <Text key={idx} style={styles.bulletText} orphans={0} widows={0}>
                {`• ${detail.title}：${detail.content}`}
              </Text>
            ))}
          </View>
        ))}

        <View style={styles.divider} />

        {/* 技能&证书 */}
        <Text style={styles.sectionTitle}>技能&证书</Text>
        {skills.map((skill, index) => (
          <Text key={index} style={styles.skillContent} orphans={0} widows={0}>
            {`• ${skill.category}：${skill.content}`}
          </Text>
        ))}
      </Page>
    </Document>
  );
};
